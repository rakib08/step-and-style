import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UploadedFiles,
    UseInterceptors,
    ParseIntPipe,
    UploadedFile,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import * as Papa from 'papaparse';
  
  @Controller('products')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    // Add a new product
    @Post('add')
    @UseInterceptors(
      FilesInterceptor('images', 5, {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            callback(null, uniqueName);
          },
        }),
      }),
    )
    async addProduct(
      @Body() data: any,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      try {
        const imagePaths = files?.map((file) => file.path) || [];
        if (!data) {
          throw new Error('Product data is required.');
        }
        return this.productService.createProduct(data, imagePaths);
      } catch (error) {
        console.error('Error adding product:', error.message);
        throw new Error('Error adding product: ' + error.message);
      }
    }
  
    // Get all products
    @Get()
    async getAllProducts() {
      try {
        return this.productService.getAllProducts();
      } catch (error) {
        console.error('Error fetching products:', error.message);
        throw new Error('Error fetching products: ' + error.message);
      }
    }
  
    // Get product by ID
    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number) {
      try {
        return this.productService.getProductById(id);
      } catch (error) {
        console.error('Error fetching product:', error.message);
        throw new Error('Error fetching product: ' + error.message);
      }
    }
  
    // Update product
    @Patch(':id')
    @UseInterceptors(
      FilesInterceptor('images', 5, {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            callback(null, uniqueName);
          },
        }),
      }),
    )
    async updateProduct(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: any,
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      try {
        const imagePaths = files?.map((file) => file.path) || [];
        if (!data) {
          throw new Error('Product data is required.');
        }
        return this.productService.updateProduct(id, data, imagePaths);
      } catch (error) {
        console.error('Error updating product:', error.message);
        throw new Error('Error updating product: ' + error.message);
      }
    }
  
    // Delete product
    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
      try {
        return this.productService.deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error.message);
        throw new Error('Error deleting product: ' + error.message);
      }
    }
  
    // Bulk upload products
    @Post('bulk-upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            callback(null, uniqueName);
          },
        }),
      }),
    )
    async bulkUpload(@UploadedFile() file: Express.Multer.File) {
      try {
        // Ensure file exists
        if (!file) {
          throw new Error('No file uploaded.');
        }
  
        // Parse CSV content
        const fileContent = file.buffer.toString('utf-8');
        const parsedData = Papa.parse(fileContent, { header: true }).data;
  
        // Validate parsed data
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          throw new Error('Invalid or empty file content.');
        }
  
        // Call the product service for bulk upload
        return this.productService.bulkUpload(parsedData);
      } catch (error) {
        console.error('Error during bulk upload:', error.message);
        throw new Error('Error during bulk upload: ' + error.message);
      }
    }
  }
  