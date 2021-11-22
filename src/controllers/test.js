import connection from '../database.js';

export default async function test(req, res) {
    try {
        const result = await connection.query(`
        select
        jsonb_build_object(
            'type', plan.type,
            'day', plan.days,
            'objs', plan.objs,
            'date', plan.date) AS plan,
        jsonb_build_object(
            'name', address.complete_name,
            'address', address.delivery_address,
            'cep', address.cep,
            'city', address.city,
            'state', address.state ) AS address,
        jsonb_build_object('name', users.name, 'email', users.email) AS user
        
        from plan 
        join address
        on address.plan_id = plan.id
        join users
        on users.id = plan.user_id;`);
        // console.log(result.rows[0].plan[0]);
        return res.status(200).send(result.rows);
    } catch (error) {
        // console.log(error);
        // console.log(error)
        return res.sendStatus(500);
    }
}
