import { getClient } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface ConstitutionPart {
    id: string;
    number: number;
    name: string;
    content: string | null;
    parent_id: string | null;
    type: string;
}

interface HierarchicalConstitutionPart extends ConstitutionPart {
    children: HierarchicalConstitutionPart[];
}

export async function GET(request: NextRequest) {
  try {
    const sql = await getClient();
    const { rows } = await sql`SELECT * FROM constitution_parts ORDER BY parent_id ASC, number ASC`;

    // Function to build the hierarchical structure
    const buildHierarchy = (items: ConstitutionPart[], parentId: string | null = null): HierarchicalConstitutionPart[] => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildHierarchy(items, item.id)
        }));
    };

    const hierarchicalData = buildHierarchy(rows as ConstitutionPart[], null);

    return NextResponse.json(hierarchicalData);
  } catch (error) {
    console.error('Error fetching constitution parts:', error);
    return NextResponse.json({ error: 'Failed to fetch constitution parts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = await getClient();
    const { number, name, content, parent_id, type } = await request.json();

    if (!name || !type || (type !== 'title' && !parent_id)) {
      return NextResponse.json({ error: 'Missing required fields: name, type, and parent_id (for non-titles)' }, { status: 400 });
    }

    const id = uuidv4();

    // Check if the chosen number already exists for the given parent_id
    const { rows: existingParts } = await sql`SELECT id, number FROM constitution_parts WHERE parent_id = ${parent_id} AND number >= ${number} ORDER BY number ASC`;

    if (existingParts.length > 0) {
      // Shift existing parts to make space for the new one
      for (const part of existingParts) {
        await sql`UPDATE constitution_parts SET number = ${part.number + 1} WHERE id = ${part.id}`;
      }
    }

    // Insert the new part
    await sql`INSERT INTO constitution_parts (id, number, name, content, parent_id, type) VALUES (${id}, ${number}, ${name}, ${content}, ${parent_id}, ${type})`;

    return NextResponse.json({ message: 'Part added successfully', id }, { status: 201 });
  } catch (error) {
    console.error('Error adding constitution part:', error);
    return NextResponse.json({ error: 'Failed to add constitution part' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sql = await getClient();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    // Get the parent_id and number of the part to be deleted
    const { rows: [deletedPart] } = await sql`SELECT parent_id, number FROM constitution_parts WHERE id = ${id}`;

    if (!deletedPart) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    // Delete the part
    await sql`DELETE FROM constitution_parts WHERE id = ${id}`;

    // Re-number remaining parts under the same parent_id
    await sql`UPDATE constitution_parts SET number = number - 1 WHERE parent_id = ${deletedPart.parent_id} AND number > ${deletedPart.number}`;

    return NextResponse.json({ message: 'Part deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting constitution part:', error);
    return NextResponse.json({ error: 'Failed to delete constitution part' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sql = await getClient();
    const { id, number, name, content, parent_id, type } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    // Get current data of the part
    const { rows: [currentPart] } = await sql`SELECT * FROM constitution_parts WHERE id = ${id}`;

    if (!currentPart) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    const oldParentId = currentPart.parent_id;
    const oldNumber = currentPart.number;

    // If parent_id or number is changing, handle re-numbering
    if (parent_id !== undefined && parent_id !== oldParentId) {
      // Re-number old parent's children
      await sql`UPDATE constitution_parts SET number = number - 1 WHERE parent_id = ${oldParentId} AND number > ${oldNumber}`;

      // Re-number new parent's children
      if (number !== undefined) {
        await sql`UPDATE constitution_parts SET number = number + 1 WHERE parent_id = ${parent_id} AND number >= ${number}`;
      }
    } else if (number !== undefined && number !== oldNumber) {
      // Only number is changing within the same parent
      if (number < oldNumber) {
        await sql`UPDATE constitution_parts SET number = number + 1 WHERE parent_id = ${parent_id} AND number >= ${number} AND number < ${oldNumber}`;
      } else {
        await sql`UPDATE constitution_parts SET number = number - 1 WHERE parent_id = ${parent_id} AND number > ${oldNumber} AND number <= ${number}`;
      }
    }

    // Update the part
    await sql`UPDATE constitution_parts SET
      number = COALESCE(${number}, ${currentPart.number}),
      name = COALESCE(${name}, ${currentPart.name}),
      content = COALESCE(${content}, ${currentPart.content}),
      parent_id = COALESCE(${parent_id}, ${currentPart.parent_id}),
      type = COALESCE(${type}, ${currentPart.type})
      WHERE id = ${id}`;

    return NextResponse.json({ message: 'Part updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating constitution part:', error);
    return NextResponse.json({ error: 'Failed to update constitution part' }, { status: 500 });
  }
}
