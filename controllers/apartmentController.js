const url = require('url');
const Apartment = require('../models/apartmentModel');
const { ApartmentJson } =  require('../helper/jsonHelper');
const customLabels = {
    docs: 'apartments',
    totalDocs: 'totalCount',
    limit: 'perPage',
};
exports.createApartments = async (req, res, next) => {
    try {
        const { apartmentName, apartmentDescription, floorAreaSize, 
            pricePerMonth, numberOfRooms, geoLocation, address, isRented } = req.body;
        const owner = req.user;
        const newApartment = new Apartment({ apartmentName, apartmentDescription, floorAreaSize,
            pricePerMonth, numberOfRooms, geoLocation, owner, address, isRented});
        await newApartment.save();
        return res.status(200).json({data: new ApartmentJson(newApartment)});
    } catch (error) {
        next(error)
    }
};
exports.updateApartment = async (req, res, next) => {
    try {
        const updatedBody = req.body;
        const id = req.params.id;
        await Apartment.findByIdAndUpdate(id, updatedBody);
        const apartment = await Apartment.findById(id);
        return res.status(200).json({
            data: new ApartmentJson(apartment),
            message: 'Apartment details has been updated'
        });
    } catch (error) {
        next(error)
    }
};
exports.getApartments = async (req, res, next) => {
            const filter = req.user.role === "client" ? {isRented: false} : {};
            const queryParams = url.parse(req.url,true).query;
            const {page, limit} = queryParams;
            const options = {
                page,
                limit,
                sort: { updatedAt: -1 },
                populate:'owner',
                customLabels
            };

    Apartment.paginate(filter, options, function (err, {apartments, totalCount, page}) {
            if (err) next(err);
            return res.status(200).json({
                data: {
                    apartments:apartments.map((apartment) => {
                        return new ApartmentJson(apartment);
                    }),
                    totalCount,
                    page
                },

            });

    });
};
exports.deleteApartment = async (req, res, next) => {
    try {
        const apartMentId = req.params.id;
        await Apartment.findByIdAndDelete(apartMentId);
        return res.status(200).json({
            data: null,
            message: 'Listing has been deleted'
        });
    } catch (error) {
        next(error)
    }
};