const {SeatClass}= require('../db/models')

module.exports = {
    index : async (req,res,next) => {
        try {
            const seatclass = await SeatClass.findAll();
            
            return res.status(200).json({
                status: true,
                message:'success',
                data: seatclass
            });
        } catch (error) {
            next(error);
        }
    },
    store : async (req, res, next) => {
        try {
            const{name, description } = req.body;
            const ready = await SeatClass.findOne({where: {name:name}})

            if(ready){
                return res.status(404).json({
                    status: false,
                    message:'seatclass is already exist',
                    data: null
                });
            }
            const seatclass = await SeatClass.create({
                name: name,
                description: description  
             });
             
            return res.status(201).json({
                status: true,
                message:'success',
                data: seatclass
            });
        } catch (error) {
            next(error);
        }
    },
    show: async (req,res,next)=>{
        try {
            const {seatclass_id} = req.params;

            const seatclass = await SeatClass.findOne({
                where:{id:seatclass_id}
            });

            if (!seatclass){
                return res.status(401).json({
                    status: false,
                    message:`can't find seatclass with id ${seatclass_id}`,
                    data: null
                })
            }
            return res.status(200).json({
                status: true,
                message:'success',
                data: seatclass
            });
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const {seatclass_id} = req.params;

            const updated = await SeatClass.update(req.body, {where: {id: seatclass_id}});

            if (updated[0] == 0) {
                return res.status(404).json({
                    status: false,
                    message: `can't find seatclass with id ${seatclass_id}`,
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
            const {seatclass_id} = req.params;

            const deleted = await SeatClass.destroy({where: {id: seatclass_id}});

            if (!deleted) {
                return res.status(404).json({
                    status: false,
                    message: `can't find seatclass with id ${seatclass_id}`,
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