"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    create(item) {
        return this.model.create(item);
    }
    findOne(filter, projection, options) {
        return this.model.findOne(filter, projection, options);
    }
    findById(id, projection, options) {
        return this.model.findById(id, projection, options);
    }
    find(filter, projection, options) {
        return this.model.find({
            ...filter,
            isDeleted: false,
        }, projection, options);
    }
    findAll(filter, projection, options) {
        return this.model.find(filter, projection, options);
    }
    count(filter) {
        return this.model.countDocuments(filter);
    }
    findOneAndUpdate(filter, update, options) {
        return this.model.findOneAndUpdate(filter, update, {
            new: true,
            ...options,
        });
    }
    updateById(id, update, options) {
        return this.model.findByIdAndUpdate(id, update, {
            new: true,
            ...options,
        });
    }
    updateMany(filter, update) {
        return this.model.updateMany(filter, update);
    }
    deleteMany(filter) {
        return this.model.deleteMany(filter);
    }
    async softDeleteById(id) {
        return this.model.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                changeCredentialTimestamp: new Date(),
            },
        }, { new: true });
    }
    async restoreById(id) {
        return this.model.findByIdAndUpdate(id, {
            $set: {
                isDeleted: false,
                deletedAt: null,
            },
        }, { new: true });
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=abstract.repository.js.map