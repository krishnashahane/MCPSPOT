var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
let VectorEmbedding = class VectorEmbedding {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], VectorEmbedding.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], VectorEmbedding.prototype, "content_type", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], VectorEmbedding.prototype, "content_id", void 0);
__decorate([
    Column('text'),
    __metadata("design:type", String)
], VectorEmbedding.prototype, "text_content", void 0);
__decorate([
    Column('simple-json'),
    __metadata("design:type", Object)
], VectorEmbedding.prototype, "metadata", void 0);
__decorate([
    Column({
        type: 'vector',
        nullable: true,
    }),
    __metadata("design:type", Array)
], VectorEmbedding.prototype, "embedding", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], VectorEmbedding.prototype, "dimensions", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], VectorEmbedding.prototype, "model", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], VectorEmbedding.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], VectorEmbedding.prototype, "updatedAt", void 0);
VectorEmbedding = __decorate([
    Entity({ name: 'vector_embeddings' })
], VectorEmbedding);
export { VectorEmbedding };
export default VectorEmbedding;
//# sourceMappingURL=VectorEmbedding.js.map