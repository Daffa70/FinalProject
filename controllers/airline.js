const {Airline}= require('../db/models')

module.exports = {
    index : async (req,res,next) => {
        try {
            const airline = await Airline.findAll();
            
            return res.status(200).json({
                status: true,
                message:'success',
                data: airline
            });
        } catch (error) {
            next(error);
        }
    },
    store : async (req, res, next) => {
        try {
            const{name, company, total_seet} = req.body;
            const ready = await Airline.findOne({where: {name:name}})

            if(ready){
                return res.status(404).json({
                    status: false,
                    message:'airline is already exist',
                    data: null
                });
            }
            const airline = await Airline.create({
                name: name,
                company: company,
                total_seet: total_seet   
             });
             
            return res.status(201).json({
                status: true,
                message:'success',
                data: airline
            });
        } catch (error) {
            next(error);
        }
    },
    show: async (req,res,next)=>{
        try {
            const {airline_id} = req.params;

            const airline = await Airline.findOne({
                where:{id:airline_id}
            });

            if (!airline){
                return res.status(401).json({
                    status: false,
                    message:`can't find airline with id ${airline_id}`,
                    data: null
                })
            }
            return res.status(200).json({
                status: true,
                message:'success',
                data: airline
            });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const {airline_id} = req.params;

            const updated = await Airline.update(req.body, {where: {id: airline_id}});

            if (updated[0] == 0) {
                return res.status(404).json({
                    status: false,
                    message: `can't find airline with id ${airline_id}`,
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
            const {airline_id} = req.params;

            const deleted = await Airline.destroy({where: {id: airline_id}});

            if (!deleted) {
                return res.status(404).json({
                    status: false,
                    message: `can't find airline with id ${airline_id}`,
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