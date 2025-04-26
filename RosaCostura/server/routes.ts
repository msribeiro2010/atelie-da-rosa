import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertCategorySchema, insertServiceRequestSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configuração do multer para upload de imagens
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-image-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Apenas imagens (JPEG, PNG, GIF, WEBP) são permitidas.'));
  }
};

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // API routes prefix
  const apiPrefix = "/api";
  
  // Products routes
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const query = req.query.q as string | undefined;
      
      const products = await storage.getAllProducts(categoryId, query);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post(`${apiPrefix}/admin/products`, async (req, res) => {
    try {
      console.log("Recebido dados do produto:", req.body);
      
      // Convertendo preço para número para compatibilidade com o banco
      if (req.body.price && typeof req.body.price === 'string') {
        req.body.price = parseFloat(req.body.price);
      }
      
      const validatedData = insertProductSchema.parse(req.body);
      console.log("Dados validados:", validatedData);
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Erro de validação Zod:", error.errors);
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  });

  app.put(`${apiPrefix}/admin/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      console.log("Recebido dados para atualização do produto:", req.body);
      
      // Convertendo preço para número para compatibilidade com o banco
      if (req.body.price && typeof req.body.price === 'string') {
        req.body.price = parseFloat(req.body.price);
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      console.log("Dados validados para atualização:", validatedData);
      
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Erro de validação Zod (update):", error.errors);
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
  });

  app.delete(`${apiPrefix}/admin/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Categories routes
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get(`${apiPrefix}/categories/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  app.post(`${apiPrefix}/admin/categories`, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });

  app.put(`${apiPrefix}/admin/categories/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });

  app.delete(`${apiPrefix}/admin/categories/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCategory(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });

  // Service requests routes
  app.get(`${apiPrefix}/service-requests`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (req.user.isAdmin) {
        const serviceRequests = await storage.getAllServiceRequests();
        return res.json(serviceRequests);
      } else {
        const serviceRequests = await storage.getUserServiceRequests(req.user.id);
        return res.json(serviceRequests);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
      res.status(500).json({ message: "Error fetching service requests" });
    }
  });

  app.post(`${apiPrefix}/service-requests`, async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertServiceRequestSchema.parse(req.body);
      
      const serviceRequest = await storage.createServiceRequest({
        ...validatedData,
        userId: req.user.id
      });
      
      res.status(201).json(serviceRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating service request:", error);
      res.status(500).json({ message: "Error creating service request" });
    }
  });

  app.put(`${apiPrefix}/admin/service-requests/:id/status`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const serviceRequest = await storage.updateServiceRequestStatus(id, status);
      
      if (!serviceRequest) {
        return res.status(404).json({ message: "Service request not found" });
      }
      
      res.json(serviceRequest);
    } catch (error) {
      console.error("Error updating service request status:", error);
      res.status(500).json({ message: "Error updating service request status" });
    }
  });

  // Messages routes
  app.post(`${apiPrefix}/messages`, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Error creating message" });
    }
  });

  app.get(`${apiPrefix}/admin/messages`, async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.put(`${apiPrefix}/admin/messages/:id/read`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Error marking message as read" });
    }
  });

  // Customers routes
  app.get(`${apiPrefix}/admin/customers`, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Error fetching customers" });
    }
  });

  // Upload de imagens
  app.post(`${apiPrefix}/admin/upload`, upload.single('image'), (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
      }

      // Construindo a URL para a imagem
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const relativePath = `/uploads/${req.file.filename}`;
      const imageUrl = `${baseUrl}${relativePath}`;

      // Garantir que o tipo de conteúdo está definido corretamente
      res.setHeader('Content-Type', 'application/json');
      
      // Logging para debug
      console.log('Upload de imagem bem-sucedido:', {
        imageUrl,
        filename: req.file.filename
      });
      
      // Resposta JSON
      res.status(200).json({ 
        imageUrl,
        filename: req.file.filename,
        originalname: req.file.originalname 
      });
    } catch (error) {
      console.error("Erro no upload de imagem:", error);
      res.status(500).json({ message: "Erro ao processar o upload da imagem" });
    }
  });

  // Testimonials routes
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  app.get(`${apiPrefix}/admin/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  app.put(`${apiPrefix}/admin/testimonials/:id/approve`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.approveTestimonial(id);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      console.error("Error approving testimonial:", error);
      res.status(500).json({ message: "Error approving testimonial" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
