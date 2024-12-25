from config import db

class User(db.Model):
    __tablename__ = 'users'
    
    # User fields
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    def to_json(self):
        """Convert User object to JSON."""
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "userName": self.username,
            "email": self.email,
            # It's generally a bad practice to return the password in any API response.
            # Ensure this is handled securely in your real application.
        }

