import { db } from "./index";
import * as schema from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting database seed...");

    // Check if admin user exists
    const adminCheck = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "admin")
    });

    if (!adminCheck) {
      // Create admin user
      console.log("Creating admin user...");
      const adminPassword = await hashPassword("admin123");
      await db.insert(schema.users).values({
        username: "admin",
        password: adminPassword,
        firstName: "Admin",
        lastName: "User",
        email: "admin@ateliedarosa.com",
        isAdmin: true
      });
    }

    // Check if categories exist
    const categoriesCheck = await db.query.categories.findMany();
    
    if (categoriesCheck.length === 0) {
      console.log("Creating product categories...");
      
      // Create categories
      const categories = [
        { name: "Roupas", description: "Peças de vestuário feitas à mão" },
        { name: "Acessórios", description: "Acessórios e bolsas artesanais" },
        { name: "Decoração", description: "Itens decorativos para sua casa" }
      ];
      
      await db.insert(schema.categories).values(categories);
    }

    // Get categories to use their IDs
    const categories = await db.query.categories.findMany();
    const categoryMap = categories.reduce((map: Record<string, number>, category: any) => {
      map[category.name] = category.id;
      return map;
    }, {} as Record<string, number>);

    // Check if products exist
    const productsCheck = await db.query.products.findMany();
    
    if (productsCheck.length === 0 && Object.keys(categoryMap).length > 0) {
      console.log("Creating sample products...");
      
      // Create products
      const products = [
        {
          name: "Vestido Floral Artesanal",
          description: "Peça exclusiva em algodão com estampa floral e acabamento feito à mão.",
          price: "289.90",
          imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: categoryMap["Roupas"],
          inStock: true
        },
        {
          name: "Bolsa Artesanal Bordada",
          description: "Bolsa artesanal com detalhes em bordado manual, confeccionada com materiais sustentáveis.",
          price: "159.90",
          imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: categoryMap["Acessórios"],
          inStock: true
        },
        {
          name: "Conjunto de Almofadas Decorativas",
          description: "Conjunto com 3 almofadas decorativas feitas com tecidos de alta qualidade e detalhes em bordado.",
          price: "129.90",
          imageUrl: "https://images.unsplash.com/photo-1590139370383-9586f5be4294?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: categoryMap["Decoração"],
          inStock: true
        },
        {
          name: "Nécessaire Floral",
          description: "Nécessaire feita à mão em tecido impermeável com estampa floral exclusiva.",
          price: "79.90",
          imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: categoryMap["Acessórios"],
          inStock: true
        },
        {
          name: "Saia Midi Artesanal",
          description: "Saia midi confeccionada artesanalmente com tecido leve e confortável.",
          price: "199.90",
          imageUrl: "https://images.unsplash.com/photo-1577900232427-18219b8349ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: categoryMap["Roupas"],
          inStock: true
        },
        {
          name: "Toalha de Mesa Bordada",
          description: "Toalha de mesa com bordados feitos à mão, perfeita para ocasiões especiais.",
          price: "149.90",
          imageUrl: "https://images.unsplash.com/photo-1576757286722-de9a91eb0d64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          categoryId: categoryMap["Decoração"],
          inStock: true
        }
      ];
      
      await db.insert(schema.products).values(products);
    }

    // Check if sample customer exists
    const customerCheck = await db.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.username, "cliente")
    });

    if (!customerCheck) {
      // Create sample customer
      console.log("Creating sample customer...");
      const customerPassword = await hashPassword("cliente123");
      await db.insert(schema.users).values({
        username: "cliente",
        password: customerPassword,
        firstName: "Maria",
        lastName: "Silva",
        email: "maria@exemplo.com",
        phone: "(11) 98765-4321",
        isAdmin: false
      });
    }

    // Get the customer to use their ID
    const customer = await db.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.username, "cliente")
    });

    if (customer) {
      // Check if testimonials exist
      const testimonialsCheck = await db.query.testimonials.findMany();
      
      if (testimonialsCheck.length === 0) {
        console.log("Creating sample testimonials...");
        
        // Create sample testimonials
        const testimonials = [
          {
            userId: customer.id,
            text: "O vestido sob medida que encomendei ficou perfeito! Cada detalhe foi cuidadosamente trabalhado e o acabamento é impecável. Recomendo muito o Ateliê da Rosa!",
            rating: 5,
            approved: true
          },
          {
            userId: customer.id,
            text: "As almofadas decorativas que comprei são lindas e feitas com um acabamento incrível! Mudaram completamente o visual da minha sala. Voltarei com certeza para comprar mais!",
            rating: 5,
            approved: true
          }
        ];
        
        await db.insert(schema.testimonials).values(testimonials);
      }
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
