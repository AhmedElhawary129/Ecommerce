import { DeleteResult, FilterQuery, Model, PopulateOptions, Types } from "mongoose";

interface FindOptions<TDocument> {
    filter?: FilterQuery<TDocument>;
    populate?: PopulateOptions[];
    select?: string;
    sort?: string;
    page?: number;
}

export abstract class DataBaseRepository<TDocument> {
    constructor(private readonly model: Model<TDocument>) {}

    async create (data: Partial<TDocument>): Promise<TDocument> {
        return this.model.create(data)
    }

    //----------------------------------------------------------------------------------------------------------------

    async findOne ({filter = {}, populate = []}: FindOptions<TDocument>): Promise<TDocument | null> {
        return this.model.findOne(filter).populate(populate)
    }

    //----------------------------------------------------------------------------------------------------------------

    async find ({filter = {}, populate = [], page = 1, sort = "", select= ""}: FindOptions<TDocument>): Promise<TDocument[] | []> {
        const query = this.model.find(filter)
        if (populate)  query.populate(populate)
        if (select)  query.select(select.replaceAll(",", " "))
        if (sort)  query.sort(sort.replaceAll(",", " "))
        if (!page) {
            return await query
        }
        const limit = 3
        const skip = (page - 1) * limit
        const result = await query.skip(skip).limit(limit)
        return result
    }

    //----------------------------------------------------------------------------------------------------------------

    async findById (id: Types.ObjectId): Promise<TDocument | null> {
        return this.model.findById(id)
    }

    //----------------------------------------------------------------------------------------------------------------

    async findOneAndUpdate (filter: FilterQuery<TDocument>, data: Partial<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndUpdate(filter, data, {new: true})
    }

    //----------------------------------------------------------------------------------------------------------------

    async findOneAndDelete (filter: FilterQuery<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndDelete(filter)
    }

    //----------------------------------------------------------------------------------------------------------------

    async deleteOne (filter: FilterQuery<TDocument>): Promise<DeleteResult | null> {
        return this.model.deleteOne(filter)
    }

    //----------------------------------------------------------------------------------------------------------------

    async deleteMany(filter: FilterQuery<TDocument>): Promise<DeleteResult | null> {
        return this.model.deleteMany(filter)
    }
}
