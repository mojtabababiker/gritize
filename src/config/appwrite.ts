"use server";
import { Client, Account, Databases, Storage } from "node-appwrite";
import { Settings } from "@/constant/setting";

/**
 * Creates and configures an admin client with Appwrite services.
 *
 * @returns {Promise<{
 *   account: Account,
 *   databases: Databases,
 *   storage: Storage
 * }>} An object containing initialized Appwrite service instances:
 *   - account: For managing user accounts and authentication
 *   - databases: For interacting with Appwrite databases
 *   - storage: For handling file storage operations
 *
 * @throws {Error} If unable to initialize the client with provided settings
 *
 * @example
 * ```typescript
 * const { account } = await createAdminClient();
 * ```
 */
export const createAdminClient = async (): Promise<{
  account: Account;
  databases: Databases;
  storage: Storage;
}> => {
  const client = new Client()
    .setEndpoint(Settings.endpoint)
    .setProject(Settings.project)
    .setKey(Settings.apiKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};

/**
 * Creates an authenticated Appwrite client for user operations.
 *
 * @throws {Error} When no valid session cookie is found.
 * @returns {Promise<{
 *   account: Account,
 *   databases: Databases,
 *   storage: Storage
 * }>} An object containing Appwrite service instances:
 *   - account: For user account operations
 *   - databases: For database operations
 *   - storage: For file storage operations
 */
export const createUserClient = async (
  session: string
): Promise<{
  account: Account;
  databases: Databases;
  storage: Storage;
}> => {
  const client = new Client()
    .setEndpoint(Settings.endpoint)
    .setProject(Settings.project)
    .setSession(session);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};
