const {FlightPrice, SeatClass, Flight_schedulle}= require('../db/models');

module.exports = {
    index : async (req,res,next) => {
        try {
            const flight_price = await FlightPrice.findAll();
            
            return res.status(200).json({
                status: true,
                message:'success',
                data: flight_price
            });
        } catch (error) {
            next(error);
        }
    },
    store : async (req, res, next) => {
        try {
            const{schedulle_id, class_id, price} = req.body;
            const ready = await FlightPrice.findOne({where:{schedulle_id,class_id, price}})
            
            const schedulleReady = await Flight_schedulle.findOne({where: {id:schedulle_id}})
            const classReady = await SeatClass.findOne({where: {id:class_id}})

            if(ready){
                return res.status(404).json({
                    status: false,
                    message:'flight_price is already exist',
                    data: null
                });
            }
            if(!schedulleReady){
                return res.status(404).json({
                    status: false,
                    message:'schedulleReady is not found',
                    data: null
                });
            }
            if(!classReady){
                return res.status(404).json({
                    status: false,
                    message:'classReady is not found',
                    data: null
                });
            }
            const flight_price = await FlightPrice.create({
                schedulle_id: schedulle_id,
                class_id: class_id,
                price: price   
             });
             
            return res.status(201).json({
                status: true,
                message:'success',
                data: flight_price
            });
        } catch (error) {
            next(error);
        }
    },
    show: async (req,res,next)=>{
        try {
            const {flight_price_id} = req.params;

            const flight_price = await FlightPrice.findOne({
                where:{id:flight_price_id}
            });

            if (!flight_price){
                return res.status(401).json({
                    status: false,
                    message:`can't find flight_price with id ${flight_price_id}`,
                    data: null
                })
            }
            return res.status(200).json({
                status: true,
                message:'success',
                data: flight_price
            });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const {flight_price_id} = req.params;

            const updated = await FlightPrice.update(req.body, {where: {id: flight_price_id}});

            if (updated[0] == 0) {
                return res.status(404).json({
                    status: false,
                    message: `can't find flight_price with id ${flight_price_id}`,
                    data: null
                });
            }

            return res.status(201).json({
                status: true,
                message: 'success',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    },
    destroy: async (req, res, next) => {
        try {
            const {flight_price_id} = req.params;

            const deleted = await FlightPrice.destroy({where: {id: flight_price_id}});

            if (!deleted) {
                return res.status(404).json({
                    status: false,
                    message: `can't find flight_price with id ${flight_price_id}`,
                    data: null
                });
            }

            return res.status(200).json({
                status: true,
                message: 'success',
                data: deleted
            });
        } catch (error) {
            next(error);
        }
    }
};