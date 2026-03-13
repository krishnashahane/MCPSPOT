var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, } from 'typeorm';
/**
 * OAuth Token entity for database storage
 * Represents OAuth tokens issued by MCPSpot's authorization server
 */
let OAuthToken = class OAuthToken {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OAuthToken.prototype, "id", void 0);
__decorate([
    Index(),
    Column({ name: 'access_token', type: 'varchar', length: 512, unique: true }),
    __metadata("design:type", String)
], OAuthToken.prototype, "accessToken", void 0);
__decorate([
    Column({ name: 'access_token_expires_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OAuthToken.prototype, "accessTokenExpiresAt", void 0);
__decorate([
    Index(),
    Column({ name: 'refresh_token', type: 'varchar', length: 512, nullable: true, unique: true }),
    __metadata("design:type", String)
], OAuthToken.prototype, "refreshToken", void 0);
__decorate([
    Column({ name: 'refresh_token_expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], OAuthToken.prototype, "refreshTokenExpiresAt", void 0);
__decorate([
    Column({ type: 'varchar', length: 512, nullable: true }),
    __metadata("design:type", String)
], OAuthToken.prototype, "scope", void 0);
__decorate([
    Index(),
    Column({ name: 'client_id', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OAuthToken.prototype, "clientId", void 0);
__decorate([
    Index(),
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OAuthToken.prototype, "username", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OAuthToken.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], OAuthToken.prototype, "updatedAt", void 0);
OAuthToken = __decorate([
    Entity({ name: 'oauth_tokens' })
], OAuthToken);
export { OAuthToken };
export default OAuthToken;
//# sourceMappingURL=OAuthToken.js.map