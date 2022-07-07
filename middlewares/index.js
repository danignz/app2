module.exports = {
  isLoggedIn: (isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/auth/login");
    }
    next();
  }),

  checkRoles: (checkRoles = (role) => (req, res, next) => {
    if (req.session.currentUser) {
      if (req.session.currentUser.role === role) {
        next();
      } else {
        return res.render("auth/login", {
          error: "Access Denied! Contact with the administrator.",
        });
      }
    } else {
      return res.redirect("/auth/login");
    }
  }),
};
