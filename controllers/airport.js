const {Airport}= require('../db/models')

module.exports = {
    index : async (req,res,next) => {
        try {
            const airport = await Airport.findAll();
            
            return res.status(200).json({
                status: true,
                message:'success',
                data: airport
            });
        } catch (error) {
            next(error);
        }
    },
    store : async (req, res, next) => {
        try {
            const{name, city, state, airport_type, code} = req.body;
            const ready = await Airport.findOne({where: {name:name}})

            if(ready){
                return res.status(404).json({
                    status: false,
                    message:'airport is already exist',
                    data: null
                });
            }
            const airport = await Airport.create({
                name: name,
                city: city,
                state: state,   
                airport_type: airport_type,   
                code: code   
             });
             
            return res.status(201).json({
                status: true,
                message:'success',
                data: airport
            });
        } catch (error) {
            next(error);
        }
    },
    show: async (req,res,next)=>{
        try {
            const {airport_id} = req.params;

            const airport = await Airport.findOne({
                where:{id:airport_id}
            });

            if (!airport){
                return res.status(401).json({
                    status: false,
                    message:`can't find airport with id ${airport_id}`,
                    data: null
                })
            }
            return res.status(200).json({
                status: true,
                message:'success',
                data: airport
            });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const {airport_id} = req.params;

            const updated = await Airport.update(req.body, {where: {id: airport_id}});

            if (updated[0] == 0) {
                return res.status(404).json({
                    status: false,
                    message: `can't find airport with id ${airport_id}`,
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
            const {airport_id} = req.params;

            const deleted = await Airport.destroy({where: {id: airport_id}});

            if (!deleted) {
                return res.status(404).json({
                    status: false,
                    message: `can't find airport with id ${airport_id}`,
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