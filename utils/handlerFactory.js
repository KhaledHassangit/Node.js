const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');


//  DELETE
exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        res.status(204).send();
    });


//  UPDATE
exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true, 
            }
        );

        if (!document) {
            return next(
                new ApiError(`No document for this id ${req.params.id}`, 404)
            );
        }

        res.status(200).json({ data: document });
    });


//  CREATE
exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({ data: newDoc });
    });


//  GET ONE
exports.getOne = (Model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        let query = Model.findById(id);

        if (populationOpt) {
            query = query.populate(populationOpt);
        }

        const document = await query;

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        res.status(200).json({ data: document });
    });


//  GET ALL
exports.getAll = (Model, modelName = '', populationOpt = null) =>
    asyncHandler(async (req, res) => {

        let filter = {};
        if (req.filter) {
            filter = req.filter;
        }

        // count
        const documentsCounts = await Model.countDocuments(filter);

        // build query
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .paginate(documentsCounts)
            .filter()
            .search(modelName)
            .limitFields()
            .sort();

        let query = apiFeatures.mongooseQuery;

        if (populationOpt) {
            query = query.populate(populationOpt);
        }

        const documents = await query;

        res.status(200).json({
            results: documents.length,
            pagination: apiFeatures.paginationResult,
            data: documents,
        });
    });