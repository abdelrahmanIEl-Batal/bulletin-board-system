from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class Location(models.Model):
    country = models.CharField(max_length=40)
    city = models.CharField(max_length=40)


gender_type = (
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other')
)


class User(AbstractUser):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    date_of_birth = models.DateField()
    hometown = models.CharField(max_length=50)
    about = models.CharField(max_length=300)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True)
    website = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=gender_type)
    interests = models.CharField(max_length=100)
    avatar = models.CharField(max_length=200, null=True, blank=True)
    is_banned = models.BooleanField(default=False)
    # true if admin else moderator (no flag for posters since all users are posters by default)
    is_admin = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'about', 'date_of_birth', 'hometown', 'location']

    class Meta:
        permissions = [
            ('create_board', 'Can create a new board'),
            ('remove_board', 'Can delete an existing board'),
            ('create_thread', 'Can create a new thread'),
            ('lock_thread', 'Can lock an existing thread'),
            ('ban_user', 'Can ban an existing user'),
            ('create_post', 'Can create a new post'),
            ('create_reply', 'Can reply to an existing thread')
        ]


class Topic(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Board(models.Model):
    name = models.CharField(max_length=50)
    topic = models.ForeignKey(Topic, null=True, blank=True, on_delete=models.CASCADE)
    image = models.CharField(max_length=150, default="", null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=300, default='')


class Thread(models.Model):
    name = models.CharField(max_length=50)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    is_sticky = models.BooleanField(default=False)
    created_at = models.DateTimeField()
    is_locked = models.BooleanField(default=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE)


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    message = models.CharField(max_length=300)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)


class Reply(models.Model):
    created_at = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.CharField(max_length=200)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
