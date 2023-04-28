export const handleDelete = (req, res, db) => {
    const { id } = req.body;
    db.transaction((trx) => {
        return trx('login')
            .join('users', 'login.email', '=', 'users.email')
            .where('users.id', id)
            .del()
            .then(() => {
                return trx('users')
                .where('id', id)
                .del();
            })
            .catch(err => res.status(400).json(err))
    })
    .then(res.json('Delete successful'))
    .catch(err => res.status(400).json(err))
}