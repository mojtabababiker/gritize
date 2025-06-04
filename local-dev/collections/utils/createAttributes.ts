import { Databases } from "node-appwrite";

import { CollectionAttributes } from "../../types";
import { Settings } from "../../../src/constant/setting";

/**
 * Creates a database attribute with the specified configuration.
 *
 * This function handles the creation of various attribute types including string, integer,
 * float, boolean, URL, and enum attributes. It validates enum attributes to ensure proper
 * configuration and throws appropriate errors for invalid configurations.
 *
 * @template T - The type representing the collection schema
 * @param database - The Appwrite Databases instance used to create the attribute
 * @param collectionId - The unique identifier of the collection where the attribute will be created
 * @param key - The name/key of the attribute to be created
 * @param value - The attribute configuration object containing type, constraints, and other properties
 *
 * @throws {Error} When an unsupported attribute type is provided
 * @throws {Error} When enum attribute is missing required values array
 * @throws {Error} When enum attribute is both required and has a default value
 * @throws {Error} When enum default value is not in the defined values array
 * @throws Re-throws any database creation errors after logging
 *
 * @returns Promise<void> - Resolves when the attribute is successfully created
 *
 * @example
 * ```typescript
 * await createAttribute(database, 'users', 'name', {
 *   type: 'string',
 *   size: 100,
 *   required: true
 * });
 *
 * await createAttribute(database, 'users', 'status', {
 *   type: 'enum',
 *   values: ['active', 'inactive'],
 *   required: true
 * });
 * ```
 */
export async function createAttribute<T>(
  database: Databases,
  collectionId: string,
  key: string,
  value: CollectionAttributes<T, keyof Omit<T, "id">>[keyof Omit<T, "id">]
) {
  try {
    switch (value.type) {
      case "string":
        await database.createStringAttribute(
          Settings.databaseId,
          collectionId,
          key,
          value.size || 255, // Default size if not specified
          value.required || false,
          value.default,
          value.array || false
        );
        break;
      case "integer":
        await database.createIntegerAttribute(
          Settings.databaseId,
          collectionId,
          key,
          value.required || false,
          value.min || undefined,
          value.max || undefined,
          value.default,
          value.array || false
        );
        break;
      case "float":
        await database.createFloatAttribute(
          Settings.databaseId,
          collectionId,
          key,
          value.required || false,
          value.min || undefined,
          value.max || undefined,
          value.default,
          value.array || false
        );
        break;
      case "boolean":
        await database.createBooleanAttribute(
          Settings.databaseId,
          collectionId,
          key,
          value.required || false,
          value.default,
          value.array || false
        );
        break;
      case "url":
        await database.createUrlAttribute(
          Settings.databaseId,
          collectionId,
          key,
          value.required || false,
          value.default,
          value.array || false
        );
        break;
      case "enum":
        if (!value.values || !Array.isArray(value.values)) {
          throw new Error(`Enum attribute ${key} requires values array`);
        }
        if (value.required && value.default) {
          throw new Error(
            `Enum attribute ${key} cannot be both required and have a default value`
          );
        }
        if (value.default && !value.values.includes(value.default)) {
          throw new Error(
            `Default value for enum attribute ${key} must be one of the defined values`
          );
        }
        await database.createEnumAttribute(
          Settings.databaseId,
          collectionId,
          key,
          value.values,
          value.required || false,
          value.default,
          value.array || false
        );
        break;
      default:
        throw new Error(`Unsupported attribute type: ${value.type}`);
    }
  } catch (error) {
    console.error(`Error creating attribute ${key}:`, error);
    throw error;
  }
}
