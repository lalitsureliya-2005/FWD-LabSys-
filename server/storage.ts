import { Collection, MongoClient, ObjectId } from "mongodb";
import { LabTest, InsertLabTest } from "@shared/schema";
import { User, InsertUser } from "@shared/userSchema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export interface IStorage {
  connect(uri: string): Promise<void>;
  getLabTests(): Promise<LabTest[]>;
  getLabTest(id: string): Promise<LabTest | null>;
  createLabTest(labTest: InsertLabTest): Promise<LabTest>;
  createUser(user: InsertUser): Promise<User>;
  findUserByUsername(username: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  private client!: MongoClient;
  private labTests!: Collection<InsertLabTest>;
  private users!: Collection<Omit<User, "id">>;

  async connect(uri: string): Promise<void> {
    this.client = new MongoClient(uri);
    await this.client.connect();
    const db = this.client.db();
    this.labTests = db.collection<InsertLabTest>("lab_tests");
    this.users = db.collection<Omit<User, "id">>("users");
  }

  async getLabTests(): Promise<LabTest[]> {
    const labTests = await this.labTests.find().toArray();
    return labTests.map((test) => ({
      ...test,
      id: test._id.toHexString(),
    }));
  }

  async getLabTest(id: string): Promise<LabTest | null> {
    const test = await this.labTests.findOne({ _id: new ObjectId(id) } as any);
    if (!test) {
      return null;
    }
    return {
      ...test,
      id: test._id.toHexString(),
    };
  }

  async createLabTest(labTest: InsertLabTest): Promise<LabTest> {
    const result = await this.labTests.insertOne(labTest);
    return {
      ...labTest,
      id: result.insertedId.toHexString(),
    };
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: Omit<User, "id"> = {
      username: user.username,
      createdAt: new Date(),
    };

    const salt = randomBytes(16).toString("hex");
    const hash = (await scryptAsync(user.password, salt, 64)) as Buffer;
    newUser.passwordHash = `${salt}:${hash.toString("hex")}`;
    
    const result = await this.users.insertOne(newUser);

    return {
      ...newUser,
      id: result.insertedId.toHexString(),
    };
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.users.findOne({ username });
    if (!user) {
      return null;
    }
    return {
      ...user,
      id: (user as any)._id.toHexString(),
    };
  }

  async findUserById(id: string): Promise<User | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const user = await this.users.findOne({ _id: new ObjectId(id) as any });
    if (!user) {
      return null;
    }
    return {
      ...user,
      id: (user as any)._id.toHexString(),
    };
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!hash || typeof hash !== 'string') {
      return false;
    }
    const [salt, key] = hash.split(":");
    if (!salt || !key) {
      return false;
    }
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;

    if (keyBuffer.length !== derivedKey.length) {
      return false;
    }

    // Use timingSafeEqual to prevent timing attacks
    return timingSafeEqual(keyBuffer, derivedKey);
  }
}

export const storage: IStorage = new MongoStorage();
