const taskModel = require('../Models/taskModel');

exports.createTask = async(req, res, next) => {

    const {title} = req.body;

    try{
        await taskModel.createTask(req.user.id, title);
        res.status(201).json({message: 'Task created'})
    }catch(err){
        console.log(err);
        res.status(401).json({message: 'Internal Server Error'});
    }
}

exports.getTasks = async(req, res, next) => {
    try{
        const tasks = await taskModel.getTasks(req.user.id);
        res.json(tasks);
    }catch(err){
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}

exports.updateTask = async(req, res) => {

    const { id } = req.params;
    const { completed } = req.body;

    try {

        await taskModel.updateTask(
            id,
            req.user.id,
            completed
        );

        res.json({
            message: 'Task Updated'
        });

    } catch(err){

        console.log(err);

        res.status(500).json({
            message: 'Error updating task'
        });
    }
}

exports.deleteTask = async (req, res) => {
    const {id} = req.params;

    try{
        await taskModel.deleteTask(id, req.user.id);
        res.json({message: 'Task deleted'})
    }
    catch(err){
        res.status(500).json({ message: 'Error deleting task' });
    }
}

exports.getHeatmap = async (req, res) => {
    try{
        const rows = await taskModel.getHeatmapData(req.user.id);
        res.json(rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error fetching heatmap data' });
    }
}

exports.getStreak = async (req, res) => {
    try{
        const streak = await taskModel.getStreak(req.user.id);
        res.json(streak);
    }
    catch(err){
        res.status(501).json({message: 'Error fetching streak'})
    }
}
    

exports.getAchievements = async (req, res) => {
    try {
        const achievements = await taskModel.getAchievements(req.user.id);
        res.json(achievements);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching achievements"});
    }
};

exports.getHistoryByDate = async (req, res) => {
    try{
        const history = await taskModel.getHistoryByDate(req.user.id, req.params.date);
        res.json(history);
    }catch (err){
        console.error(err);
        res.status(500).json({message: "Error fetching history"});
    }
};
