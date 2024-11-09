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

class CompData(db.Model):
    __tablename__ = 'comp_data'
    
    # CompData fields
    id = db.Column(db.Integer, primary_key=True)
    end_year = db.Column(db.String(4), nullable=True)  # Optional
    intensity = db.Column(db.Integer, nullable=True)   # Should be Integer for numerical values
    sector = db.Column(db.String(80), nullable=True)
    insight = db.Column(db.String(80), nullable=True)
    topic = db.Column(db.String(80), nullable=True)
    url = db.Column(db.String(200), nullable=True)     # URLs can be longer, increased length
    region = db.Column(db.String(80), nullable=True)
    start_year = db.Column(db.String(4), nullable=True) # Optional
    impact = db.Column(db.String(120), nullable=True)   # Optional
    added = db.Column(db.String(80), nullable=True)
    published = db.Column(db.String(80), nullable=True)
    country = db.Column(db.String(80), nullable=True)
    relevance = db.Column(db.Integer, nullable=True)   # Should be Integer for numerical values
    pestle = db.Column(db.String(80), nullable=True)
    source = db.Column(db.String(80), nullable=True)
    title = db.Column(db.String(200), unique=True ,nullable=True)   # Titles can be longer, increased length
    likelihood = db.Column(db.Integer, nullable=True)  # Should be Integer for numerical values

    def to_json(self):
        """Convert CompData object to JSON."""
        return {
            "end_year": self.end_year or "",  # Default empty string if None
            "intensity": self.intensity,
            "sector": self.sector,
            "insight": self.insight,
            "topic": self.topic,
            "insight": self.title,            # Used 'title' as insight
            "url": self.url,
            "region": self.region,
            "start_year": self.start_year or "",  # Default empty string if None
            "impact": self.impact or "",         # Default empty string if None
            "added": self.added,
            "published": self.published,
            "country": self.country,
            "relevance": self.relevance,
            "pestle": self.pestle,
            "source": self.source,
            "title": self.title,
            "likelihood": self.likelihood
        }
