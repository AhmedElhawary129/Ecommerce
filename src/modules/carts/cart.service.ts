import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CartRepository } from "src/DB/repository/cart.repository";
import { AddToCartDto, RemoveFromCartDto, UpdateQuantityDto} from "./dto/cart.dto";
import { ProductRepository } from "src/DB/repository";
import type { UserDocument } from "src/DB/models";
import { Types } from "mongoose";

@Injectable()
export class CartService {
    constructor(
        private readonly _cartRepository: CartRepository,
        private readonly _productRepository: ProductRepository
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    // add to cart
    async addToCart(body: AddToCartDto, user: UserDocument) {
        const { productId, quantity } = body;

        const product = await this._productRepository.findOne(
            {filter: {
                _id: productId, 
                stock: {$gte: quantity}
            }
        });
        if (!product) {
            throw new NotFoundException("Product not found or out of stock");
        }
        const cart = await this._cartRepository.findOne({
            filter: {userId: user._id}
        })
        if (!cart) {
            return await this._cartRepository.create({
                userId: user._id,
                products: [{
                    productId: Types.ObjectId.createFromHexString(productId), 
                    quantity, 
                    finalPrice: product.subPrice
                }]
            });
        }
        let productExist = cart .products.find(prod => prod.productId.toString() === productId.toString());
        if (productExist) {
            throw new BadRequestException("Product already exists in cart");
        }
        cart.products.push({
            productId: Types.ObjectId.createFromHexString(productId), 
            quantity, 
            finalPrice: product.subPrice
        })
        await cart.save();
        return {
            message: "Product added to cart successfully", cart
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // remove from cart
    async removeFromCart(body: RemoveFromCartDto, user: UserDocument) {
        const {productId} = body;

        const product = await this._productRepository.findOne({
            filter: {_id: productId}
        });
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        const cart = await this._cartRepository.findOne({
            filter: {userId: user._id, "products.productId": productId}
        })
        if (!cart) {
            throw new NotFoundException("Cart not found or product not found in cart");
        }

        cart.products = cart.products.filter(prod => prod.productId.toString() !== productId.toString());
        await cart.save();
        return {
            message: "Product removed from cart successfully", cart
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // update quantity of product in cart
    async updatQuantity(body: UpdateQuantityDto, user: UserDocument) {
        const {productId, quantity} = body;

        const cart = await this._cartRepository.findOne({
            filter: {userId: user._id}
        })
        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        const productInCart = cart.products.find(prod => prod.productId.toString() === productId.toString());
        if (!productInCart) {
            throw new NotFoundException("Product not found in cart");
        }

        const product = await this._productRepository.findOne({
            filter: {
                _id: productId,
                stock: {$gte: quantity}
            }
        });
        if (!product) {
            throw new NotFoundException("Product not found or out of stock");
        }
        productInCart.quantity = quantity;
        
        await cart.save();
        return {
            message: "Quantity updated successfully", cart
        };
    }
}
