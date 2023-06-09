const {Flight_schedulle,Airline,Airport}= require('../db/models')

module.exports = {
    index : async (req,res,next) => {
        try {
            const flight_schedulle = await Flight_schedulle.findAll();
            
            return res.status(200).json({
                status: true,
                message:'success',
                data: flight_schedulle
            });
        } catch (error) {
            next(error);
        }
    },
    store : async (req, res, next) => {
        try {
            const{airline_id, departure_time, arrival_time, departure_airport_id, arrival_airport_id} = req.body;
            const ready = await Flight_schedulle.findOne({where:{airline_id, departure_time, arrival_time, departure_airport_id, arrival_airport_id}})
            
            const airlineReady = await Airline.findOne({where: {id:airline_id}})
            const depatureAirportReady = await Airport.findOne({where: {id:departure_airport_id}})
            const arrivalAirportReady = await Airport.findOne({where: {id:arrival_airport_id}})

            if(ready){
                return res.status(404).json({
                    status: false,
                    message:'flight_schedulle is already exist',
                    data: null
                });
            }
            if(!airlineReady){
                return res.status(404).json({
                    status: false,
                    message:'airline is not found',
                    data: null
                });
            }
            if(!depatureAirportReady){
                return res.status(404).json({
                    status: false,
                    message:'depature airport is not found',
                    data: null
                });
            }
            if(!arrivalAirportReady){
                return res.status(404).json({
                    status: false,
                    message:'arrival airport is not found',
                    data: null
                });
            }
            const flight_schedulle = await Flight_schedulle.create({
                airline_id: airline_id,
                departure_time: departure_time,
                arrival_time: arrival_time,
                departure_airport_id: departure_airport_id,
                arrival_airport_id: arrival_airport_id   
             });
             
            return res.status(201).json({
                status: true,
                message:'success',
                data: flight_schedulle
            });
        } catch (error) {
            next(error);
        }
    },
    show: async (req,res,next)=>{
        try {
            const {flight_schedulle_id} = req.params;

            const flight_schedulle = await Flight_schedulle.findOne({
                where:{id:flight_schedulle_id}
            });

            if (!flight_schedulle){
                return res.status(401).json({
                    status: false,
                    message:`can't find flight_schedulle with id ${flight_schdulle_id}`,
                    data: null
                })
            }
            return res.status(200).json({
                status: true,
                message:'success',
                data: flight_schedulle
            });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const {flight_schdulle_id} = req.params;

            const updated = await Flight_schedulle.update(req.body, {where: {id: flight_schdulle_id}});

            if (updated[0] == 0) {
                return res.status(404).json({
                    status: false,
                    message: `can't find flight_schedulle with id ${flight_schdulle_id}`,
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
            const {flight_schdulle_id} = req.params;

            const deleted = await Flight_schedulle.destroy({where: {id: flight_schdulle_id}});

            if (!deleted) {
                return res.status(404).json({
                    status: false,
                    message: `can't find flight_schedulle with id ${flight_schdulle_id}`,
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