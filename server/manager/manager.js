class Manager {
    constructor(model) {
        this.model = model;
    }

    findOne(conditions = {}, projects = {}, populate = []) {
        return this.model
            .findOne(conditions, projects)
            .populate(populate)
            .lean()
            .exec();
    }

    exists(conditions = {}) {
        if (Object.keys(conditions).length === 0) {
            return false;
        }
        return this.model.exists(conditions).exec();
    }

    find(
        conditions = {},
        projects = {},
        sorts = {},
        populate = [],
        options = {},
    ) {
        options.sort = sorts;
        options.populate = populate;
        options.select = projects;
        return this.model.paginate(conditions, { ...options, lean: true });
    }

    findOneWithSort(conditions = {}, projects = {}, options = {}, populate = []) {
        return this.model
            .findOne(conditions, projects, options)
            .populate(populate)
            .lean()
            .exec();
    }

    findOneAndUpdate(conditions = {}, value, options) {
        return this.model.findOneAndUpdate(conditions, value, options);
    }

    findAll(conditions = {}, projects = {}, sorts = {}, populate = []) {
        return this.model
            .find(conditions, projects)
            .sort(sorts)
            .populate(populate)
            .lean()
            .exec();
    }

    updateOne(conditions, value) {
        return this.model.updateOne(conditions, value).exec();
    }

    updateMany(conditions, value) {
        return this.model.updateMany(conditions, value).exec();
    }

    create(Obj) {
        const doc = new this.model(Obj);
        return doc.save();
    }

    insertMany(arrayOfObjects) {
        return this.model.insertMany(arrayOfObjects);
    }

    delete(condition) {
        return this.model.deleteOne(condition).exec();
    }

    deleteMany(condition) {
        return this.model.deleteMany(condition).exec();
    }

    bulkWrite(array) {
        return this.model.bulkWrite(array);
    }

    countDocuments(condition) {
        return this.model.countDocuments(condition);
    }

    aggregate(condition) {
        return this.model.aggregate(condition).exec();
    }
}

export default Manager;
