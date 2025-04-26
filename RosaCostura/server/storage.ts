import { db } from "@db";
import {
  users,
  products,
  categories,
  serviceRequests,
  orders,
  orderItems,
  testimonials,
  messages,
  InsertUser,
  User,
  InsertProduct,
  Product,
  InsertCategory,
  Category,
  InsertServiceRequest,
  ServiceRequest,
  InsertOrder,
  Order,
  InsertOrderItem,
  OrderItem,
  InsertTestimonial,
  Testimonial,
  InsertMessage,
  Message
} from "@shared/schema";
import { eq, and, desc, asc, sql, ilike } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser: (id: number) => Promise<User | undefined>;
  getUserByUsername: (username: string) => Promise<User | undefined>;
  getUserByEmail: (email: string) => Promise<User | undefined>;
  createUser: (user: InsertUser) => Promise<User>;
  getAllUsers: () => Promise<User[]>;
  getCustomers: () => Promise<User[]>;

  // Product operations
  getProduct: (id: number) => Promise<Product | undefined>;
  createProduct: (product: InsertProduct) => Promise<Product>;
  updateProduct: (id: number, product: Partial<InsertProduct>) => Promise<Product | undefined>;
  deleteProduct: (id: number) => Promise<boolean>;
  getAllProducts: (categoryId?: number, query?: string) => Promise<Product[]>;

  // Category operations
  getCategory: (id: number) => Promise<Category | undefined>;
  createCategory: (category: InsertCategory) => Promise<Category>;
  updateCategory: (id: number, category: Partial<InsertCategory>) => Promise<Category | undefined>;
  deleteCategory: (id: number) => Promise<boolean>;
  getAllCategories: () => Promise<Category[]>;

  // Service request operations
  getServiceRequest: (id: number) => Promise<ServiceRequest | undefined>;
  createServiceRequest: (serviceRequest: InsertServiceRequest & { userId: number }) => Promise<ServiceRequest>;
  updateServiceRequestStatus: (id: number, status: string) => Promise<ServiceRequest | undefined>;
  getAllServiceRequests: () => Promise<ServiceRequest[]>;
  getUserServiceRequests: (userId: number) => Promise<ServiceRequest[]>;

  // Order operations
  getOrder: (id: number) => Promise<Order | undefined>;
  createOrder: (order: InsertOrder) => Promise<Order>;
  updateOrderStatus: (id: number, status: string) => Promise<Order | undefined>;
  getAllOrders: () => Promise<Order[]>;
  getUserOrders: (userId: number) => Promise<Order[]>;

  // Order item operations
  addOrderItem: (orderItem: InsertOrderItem) => Promise<OrderItem>;
  getOrderItems: (orderId: number) => Promise<OrderItem[]>;

  // Testimonial operations
  getTestimonial: (id: number) => Promise<Testimonial | undefined>;
  createTestimonial: (testimonial: InsertTestimonial & { userId: number }) => Promise<Testimonial>;
  approveTestimonial: (id: number) => Promise<Testimonial | undefined>;
  getApprovedTestimonials: () => Promise<Testimonial[]>;
  getAllTestimonials: () => Promise<Testimonial[]>;

  // Message operations
  getMessage: (id: number) => Promise<Message | undefined>;
  createMessage: (message: InsertMessage) => Promise<Message>;
  markMessageAsRead: (id: number) => Promise<Message | undefined>;
  getAllMessages: () => Promise<Message[]>;
  getUnreadMessages: () => Promise<Message[]>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    return result;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.query.users.findMany({
      orderBy: asc(users.createdAt)
    });
  }

  async getCustomers(): Promise<User[]> {
    return await db.query.users.findMany({
      where: eq(users.isAdmin, false),
      orderBy: asc(users.createdAt)
    });
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true
      }
    });
    return result;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [result] = await db.insert(products).values(product).returning();
    return result;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [result] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return result;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [result] = await db.delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return !!result;
  }

  async getAllProducts(categoryId?: number, query?: string): Promise<Product[]> {
    let conditions = [];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }
    
    if (query) {
      conditions.push(
        sql`(${products.name} ilike ${`%${query}%`} or ${products.description} ilike ${`%${query}%`})`
      );
    }
    
    if (conditions.length === 0) {
      return await db.query.products.findMany({
        orderBy: asc(products.name),
        with: {
          category: true
        }
      });
    } else {
      return await db.query.products.findMany({
        where: and(...conditions),
        orderBy: asc(products.name),
        with: {
          category: true
        }
      });
    }
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.query.categories.findFirst({
      where: eq(categories.id, id)
    });
    return result;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [result] = await db.insert(categories).values(category).returning();
    return result;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [result] = await db.update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return result;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const [result] = await db.delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    return !!result;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.query.categories.findMany({
      orderBy: asc(categories.name)
    });
  }

  // Service request operations
  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const result = await db.query.serviceRequests.findFirst({
      where: eq(serviceRequests.id, id),
      with: {
        user: true
      }
    });
    return result;
  }

  async createServiceRequest(request: InsertServiceRequest & { userId: number }): Promise<ServiceRequest> {
    const [result] = await db.insert(serviceRequests).values(request).returning();
    return result;
  }

  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest | undefined> {
    const [result] = await db.update(serviceRequests)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(serviceRequests.id, id))
      .returning();
    return result;
  }

  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return await db.query.serviceRequests.findMany({
      orderBy: desc(serviceRequests.createdAt),
      with: {
        user: true
      }
    });
  }

  async getUserServiceRequests(userId: number): Promise<ServiceRequest[]> {
    return await db.query.serviceRequests.findMany({
      where: eq(serviceRequests.userId, userId),
      orderBy: desc(serviceRequests.createdAt)
    });
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });
    return result;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [result] = await db.insert(orders).values(order).returning();
    return result;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [result] = await db.update(orders)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    return result;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.query.orders.findMany({
      orderBy: desc(orders.createdAt),
      with: {
        user: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: desc(orders.createdAt),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
  }

  // Order item operations
  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [result] = await db.insert(orderItems).values(orderItem).returning();
    return result;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
      with: {
        product: true
      }
    });
  }

  // Testimonial operations
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const result = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id),
      with: {
        user: true
      }
    });
    return result;
  }

  async createTestimonial(testimonial: InsertTestimonial & { userId: number }): Promise<Testimonial> {
    const [result] = await db.insert(testimonials).values(testimonial).returning();
    return result;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const [result] = await db.update(testimonials)
      .set({ approved: true })
      .where(eq(testimonials.id, id))
      .returning();
    return result;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db.query.testimonials.findMany({
      where: eq(testimonials.approved, true),
      orderBy: desc(testimonials.createdAt),
      with: {
        user: true
      }
    });
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.query.testimonials.findMany({
      orderBy: desc(testimonials.createdAt),
      with: {
        user: true
      }
    });
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.query.messages.findFirst({
      where: eq(messages.id, id)
    });
    return result;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [result] = await db.insert(messages).values(message).returning();
    return result;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [result] = await db.update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return result;
  }

  async getAllMessages(): Promise<Message[]> {
    return await db.query.messages.findMany({
      orderBy: desc(messages.createdAt)
    });
  }

  async getUnreadMessages(): Promise<Message[]> {
    return await db.query.messages.findMany({
      where: eq(messages.read, false),
      orderBy: desc(messages.createdAt)
    });
  }
}

export const storage = new DatabaseStorage();
