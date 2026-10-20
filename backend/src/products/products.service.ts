import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productRepository.count();
    if (count === 0) {
      await this.seed();
    }
  }

  private deriveStatus(stock: number, currentStatus?: string): ProductStatus {
    if (currentStatus && Object.values(ProductStatus).includes(currentStatus as ProductStatus)) {
      return currentStatus as ProductStatus;
    }
    if (stock <= 0) return ProductStatus.OUT_OF_STOCK;
    if (stock <= 10) return ProductStatus.LOW_STOCK;
    return ProductStatus.IN_STOCK;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const status = this.deriveStatus(createProductDto.stock, createProductDto.status);
    const sku =
      createProductDto.sku ||
      `PRD-${createProductDto.category.substring(0, 3).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;

    const product = this.productRepository.create({
      ...createProductDto,
      status,
      sku,
    });

    return await this.productRepository.save(product);
  }

  async findAll(query?: {
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }): Promise<{ products: Product[]; total: number }> {
    const qb = this.productRepository.createQueryBuilder('product');

    if (query?.search) {
      const s = `%${query.search.trim()}%`;
      qb.where(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search OR product.category ILIKE :search)',
        { search: s },
      );
    }

    if (query?.category && query.category !== 'All') {
      qb.andWhere('product.category = :category', { category: query.category });
    }

    if (query?.status && query.status !== 'All') {
      qb.andWhere('product.status = :status', { status: query.status });
    }

    const sortField = ['name', 'price', 'stock', 'createdAt', 'category'].includes(
      query?.sortBy || '',
    )
      ? `product.${query.sortBy}`
      : 'product.createdAt';

    const sortOrder = query?.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(sortField, sortOrder);

    const [products, total] = await qb.getManyAndCount();
    return { products, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.stock !== undefined && !updateProductDto.status) {
      product.status = this.deriveStatus(updateProductDto.stock);
    } else if (updateProductDto.status) {
      product.status = updateProductDto.status;
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully', id };
  }

  async getStats() {
    const products = await this.productRepository.find();
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce(
      (sum, p) => sum + Number(p.price) * p.stock,
      0,
    );
    const lowStockCount = products.filter(
      (p) => p.status === ProductStatus.LOW_STOCK,
    ).length;
    const outOfStockCount = products.filter(
      (p) => p.status === ProductStatus.OUT_OF_STOCK,
    ).length;
    const inStockCount = products.filter(
      (p) => p.status === ProductStatus.IN_STOCK,
    ).length;

    const categories = Array.from(new Set(products.map((p) => p.category)));

    return {
      totalProducts,
      totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
      lowStockCount,
      outOfStockCount,
      inStockCount,
      categories,
    };
  }

  async seed(): Promise<{ message: string; count: number }> {
    const sampleProducts = [
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling wireless overhead headphones with 30-hour battery life.',
        category: 'Electronics',
        price: 348.0,
        stock: 25,
        status: ProductStatus.IN_STOCK,
        sku: 'PRD-ELE-1001',
      },
      {
        name: 'Apple MacBook Air M3 (13-inch)',
        description: 'Supercharged by M3 chip, 16GB Unified Memory, 512GB SSD Storage, Midnight.',
        category: 'Computers',
        price: 1299.0,
        stock: 14,
        status: ProductStatus.IN_STOCK,
        sku: 'PRD-COM-2045',
      },
      {
        name: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Ergonomic high-precision mouse with 8K DPI tracking and Quiet Click technology.',
        category: 'Accessories',
        price: 99.99,
        stock: 4,
        status: ProductStatus.LOW_STOCK,
        sku: 'PRD-ACC-3091',
      },
      {
        name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
        description: 'Brilliant 4K UHD color accuracy with IPS Black technology and 90W power delivery.',
        category: 'Electronics',
        price: 529.5,
        stock: 8,
        status: ProductStatus.LOW_STOCK,
        sku: 'PRD-ELE-4412',
      },
      {
        name: 'Herman Miller Aeron Ergonomic Chair',
        description: 'Iconic mesh office chair engineered for posture fit, lumbar support and durability.',
        category: 'Furniture',
        price: 1495.0,
        stock: 0,
        status: ProductStatus.OUT_OF_STOCK,
        sku: 'PRD-FUR-5002',
      },
      {
        name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
        description: 'Custom full aluminum body mechanical keyboard with hot-swappable switches and QMK/VIA support.',
        category: 'Accessories',
        price: 199.0,
        stock: 18,
        status: ProductStatus.IN_STOCK,
        sku: 'PRD-ACC-6712',
      },
      {
        name: 'Anker 737 Power Bank (PowerCore 24K)',
        description: '24,000mAh 3-port portable charger with smart digital display and 140W max output.',
        category: 'Electronics',
        price: 149.99,
        stock: 35,
        status: ProductStatus.IN_STOCK,
        sku: 'PRD-ELE-7821',
      },
      {
        name: 'Kindle Paperwhite Signature Edition (32GB)',
        description: 'Glare-free 6.8" display with wireless charging and auto-adjusting front light.',
        category: 'Electronics',
        price: 189.99,
        stock: 0,
        status: ProductStatus.OUT_OF_STOCK,
        sku: 'PRD-ELE-8934',
      },
    ];

    for (const item of sampleProducts) {
      const existing = await this.productRepository.findOne({
        where: { sku: item.sku },
      });
      if (!existing) {
        await this.productRepository.save(this.productRepository.create(item));
      }
    }

    return { message: 'Database seeded successfully', count: sampleProducts.length };
  }
}
