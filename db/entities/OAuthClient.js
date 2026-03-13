var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
/**
 * OAuth Client entity for database storage
 * Represents OAuth clients registered with MCPSpot's authorization server
 */
let OAuthClient = class OAuthClient {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OAuthClient.prototype, "id", void 0);
__decorate([
    Column({ name: 'client_id', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], OAuthClient.prototype, "clientId", void 0);
__decorate([
    Column({ name: 'client_secret', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], OAuthClient.prototype, "clientSecret", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OAuthClient.prototype, "name", void 0);
__decorate([
    Column({ name: 'redirect_uris', type: 'simple-json' }),
    __metadata("design:type", Array)
], OAuthClient.prototype, "redirectUris", void 0);
__decorate([
    Column({ type: 'simple-json' }),
    __metadata("design:type", Array)
], OAuthClient.prototype, "grants", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], OAuthClient.prototype, "scopes", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], OAuthClient.prototype, "owner", void 0);
__decorate([
    Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], OAuthClient.prototype, "metadata", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OAuthClient.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OAuthClient.prototype, "updatedAt", void 0);
OAuthClient = __decorate([
    Entity({ name: 'oauth_clients' })
], OAuthClient);
export { OAuthClient };
export default OAuthClient;
//# sourceMappingURL=OAuthClient.js.map