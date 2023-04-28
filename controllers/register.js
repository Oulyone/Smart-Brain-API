import bcrypt from 'bcrypt';

export const handleRegister = (req, res, db, saltRounds) => {
    const { email, name, password} = req.body; 
    if(!email || !name || !password) {
        return res.status(400).json('incorrect from submission');
    } else {
        const hash = bcrypt.hashSync(password, saltRounds);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json(err))
    }
    
}

