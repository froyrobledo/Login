const bcrypt = require('bcryptjs')

function login(req, res) {
    
   
    res.render('login/index');
  
}


function auth(req, res) {
    const data = req.body

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {


            if (userdata.length > 0) {

                userdata.forEach(element => {
                    return bcrypt.compare(data.passwaord, element.password, (err, isMatch) => {

                        
                       
                        if (!isMatch ) {
                            res.render('login/index', { error: 'contrasena incorrecta' });
                             
                            return
                        } else {
                            loggedin =  isMatch 
                            loggedin = true;
                          
                          res.redirect('/');
                            
                        }

                    })
                    

                })

            } else {
                res.render('login/index', { err: 'contrasena incorrecta' });
                console.log('no existe');
            }

        });
    });
}


function logout(req, res) {
    if (loggedin) {
        loggedin.destroy();
    }
    res.redirect('/');
  }






function register(req, res) {
    res.render('login/register')
}

function storeUser(req, res) {
    const data = req.body
    bcrypt.hash(data.passwaord, 12).then(hash => {

        const { name, email } = data;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM users WHERE email = ? ', [data.email], (err, userdata) => {
                if (userdata > 0) {
                    res.render('login/register', { err: 'este email ya existe' });
                } else {
                    req.getConnection((err, conn) => {
                        const query = `INSERT INTO users(name, email, password) VALUES (?,?,?)`
                        console.log(query);
                        conn.query(query, [name, email, hash], (err, rows) => {
                            if (err) {
                                res.status(500).json(err)
                            }
                            res.redirect('/')

                        })
                    })

                }
            })

        })



    })
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout
}