## API Documentation for Constitution Parts Management

This API provides a comprehensive set of operations for managing a hierarchical data structure, such as a Constitution, stored in the `constitution_parts` table.

### 1. `GET /api/constitution` (Retrieve Data)

*   **Purpose:** Retrieves all parts of the Constitution from the database and returns them in a hierarchical JSON structure.
*   **Input:** No parameters or request body required.
*   **Output:** Returns a JSON array. Each element in the array represents a part of the Constitution (e.g., Title, Chapter, Article). Elements are structured hierarchically, with "children" included in the `children` field of their parent. The order of elements within each hierarchy level is determined by the `number` field.
*   **Logic:**
    1.  Selects all data from the `constitution_parts` table.
    2.  Sorts the results first by `parent_id` and then by `number` to facilitate hierarchical construction.
    3.  Uses a recursive function (`buildHierarchy`) to organize the hierarchy levels, connecting elements based on `parent_id` and `id`.
    4.  Returns the data as JSON.

### 2. `POST /api/constitution` (Add Data)

*   **Purpose:** Adds a new part (e.g., Title, Chapter, Article) to the Constitution's hierarchy.
*   **Input:** A JSON object in the request body with the following fields:
    *   `number`: The sequential number of the new part within its parent.
    *   `name`: The title or name of the part.
    *   `content`: The text of the part (can be `null` for Titles, Chapters, etc.).
    *   `parent_id`: The `id` of the parent part. For Titles, this should be `null`.
    *   `type`: The type of the part (`title`, `chapter`, `section`, `article`).
*   **Output:** Returns a JSON object with a success message and the `id` of the new part (`{ message: 'Part added successfully', id: '...' }`) with status 201. In case of an error, returns an error message with status 400 or 500.
*   **Logic:**
    1.  Generates a unique `id` for the new part using `uuidv4`.
    2.  Checks if any part already exists with the same `parent_id` and a `number` greater than or equal to the chosen number.
    3.  **Automatic Re-numbering (Shift):** If such parts are found, it increments the `number` of all these parts by 1, making space for the new part.
    4.  Inserts the new part into the `constitution_parts` table with the provided data and the chosen `number`.

### 3. `DELETE /api/constitution` (Delete Data)

*   **Purpose:** Deletes a specific part from the Constitution's hierarchy.
*   **Input:** A JSON object in the request body with the field:
    *   `id`: The `id` of the part to be deleted.
*   **Output:** Returns a JSON object with a success message (`{ message: 'Part deleted successfully' }`) with status 200. In case of an error (e.g., `id` not found), returns an error message with status 400, 404, or 500.
*   **Logic:**
    1.  Retrieves the `parent_id` and `number` of the part to be deleted.
    2.  Deletes the part from the `constitution_parts` table.
    3.  **Automatic Re-numbering (Re-number):** Decrements the `number` by 1 for all parts that had the same `parent_id` and a `number` greater than the deleted part, thus maintaining the numbering continuity.

### 4. `PUT /api/constitution` (Update Data)

*   **Purpose:** Updates an existing part of the Constitution. It can change any of the part's fields, including `number` and `parent_id`.
*   **Input:** A JSON object in the request body with the `id` field (required) and any of the following fields to update:
    *   `id`: The `id` of the part to be updated.
    *   `number`: The new sequential number.
    *   `name`: The new title/name.
    *   `content`: The new text.
    *   `parent_id`: The new parent `id`.
    *   `type`: The new type.
*   **Output:** Returns a JSON object with a success message (`{ message: 'Part updated successfully' }`) with status 200. In case of an error, returns an error message with status 400, 404, or 500.
*   **Logic:**
    1.  Retrieves the current data of the part to be updated.
    2.  **Handling `parent_id` Change:**
        *   If the `parent_id` changes, then:
            *   Re-numbers the children of the *old* parent, decrementing the `number` of parts that followed the updated part.
            *   Re-numbers the children of the *new* parent, incrementing the `number` of parts that will follow the updated part in its new position.
    3.  **Handling `number` Change (within the same parent):**
        *   If only the `number` changes (and `parent_id` remains the same), it re-numbers sibling parts to maintain continuity, shifting parts up or down depending on the new position.
    4.  Updates the part's fields in the `constitution_parts` table with the provided values. It uses `COALESCE` to retain existing values if new ones are not provided.
