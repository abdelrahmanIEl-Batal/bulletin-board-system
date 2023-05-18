import re

from django.contrib.contenttypes.models import ContentType

from .models import User, Topic, Board, Thread, Post, Reply, Location
from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from django.contrib.auth import authenticate


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'country', 'city']


class UserSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = User
        fields = [
            'id', 'name', 'username', 'email', 'date_of_birth', 'hometown', 'location', 'about', 'website',
            'interests', 'avatar', 'is_banned', 'is_admin', 'is_moderator', 'gender'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True,
                                      style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True,
                                      style={'input_type': 'password'})
    location_country = serializers.CharField(max_length=40)
    location_city = serializers.CharField(max_length=40)

    class Meta:
        model = User
        fields = [
            'name', 'username', 'email', 'date_of_birth', 'hometown', 'about', 'location_country', 'location_city',
            'website', 'gender', 'avatar', 'password1', 'password2', 'interests'
        ]

    def create(self, validated_data):
        initGroups()
        name = validated_data['name']
        username = validated_data['username']
        email = validated_data['email']
        date_of_birth = validated_data['date_of_birth']
        hometown = validated_data['hometown']
        about = validated_data['about']
        country = validated_data['location_country']
        city = validated_data['location_city']
        website = validated_data['website']
        avatar = validated_data['avatar']
        password1 = validated_data['password1']
        password2 = validated_data['password2']
        gender = validated_data['gender']
        location = Location.objects.create(country=country, city=city)
        interests = validated_data['interests']
        user = User.objects.create_user(name=name, username=username, email=email, date_of_birth=date_of_birth,
                                        hometown=hometown, gender=gender, is_admin=False, is_moderator=False,
                                        about=about, location=location, website=website, avatar=avatar,
                                        password=password1, interests=interests)
        poster_group = Group.objects.get(name='Poster')
        # poster_group.user_set.add(user)
        # poster_group.save()
        user.groups.add(poster_group)
        return user

    def validate(self, data):
        password = data['password1']
        # checks for password strength > 8 digits + upper,lower case letters
        length_error = len(password) < 8
        digit_error = re.search(r"\d", password) is None
        uppercase_error = re.search(r"[A-Z]", password) is None
        lowercase_error = re.search(r"[a-z]", password) is None

        password_ok = not (length_error or digit_error or uppercase_error or lowercase_error)

        if not password_ok:
            if length_error:
                raise serializers.ValidationError({'Password': 'Password length should be greater than 8'})
            if digit_error or uppercase_error or lowercase_error is None:
                raise serializers.ValidationError(
                    {'Password': 'Password should contain numeric, upper case and lower case letters'})

        if data['password1'] != data['password2']:
            raise serializers.ValidationError({'Password': 'Password1 and Password2 should match'})
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True,
                                     style={'input_type': 'password'})

    def validate(self, data):
        email = data['email']
        password = data['password']

        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.fullmatch(regex, email):
            raise serializers.ValidationError("Email address is not valid")

        user = authenticate(email=email, password=password)
        if user is not None:
            return user
        raise serializers.ValidationError({'Credentials': 'Wrong Credentials!, please enter a valid email/password'})


class BoardSerializer(serializers.ModelSerializer):
    threads = serializers.SerializerMethodField('get_threads')

    def get_threads(self, obj):
        return ThreadSerializer(obj.thread_set.all(), many=True).data

    class Meta:
        model = Board
        fields = ['id', 'name', 'topic', 'image', 'threads', 'description']

    def create(self, validated_data):
        name = validated_data['name']
        topic = validated_data['topic']
        image = validated_data['image']
        description = validated_data['description']
        user = self.context["request"].user
        board = Board.objects.create(name=name, topic=topic, image=image, author=user, description=description)
        return board


class TopicSerializer(serializers.ModelSerializer):
    boards = serializers.SerializerMethodField('get_boards')

    def get_boards(self, obj):
        return BoardSerializer(obj.board_set.all(), many=True).data

    class Meta:
        model = Topic
        fields = ['id', 'name', 'user', 'boards']
        extra_kwargs = {'user': {'required': False}}

    def create(self, validated_data):
        name = validated_data['name']
        user = self.context['request'].user
        topic = Topic.objects.create(name=name, user=user)
        return topic


class ThreadSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField('get_posts')
    latest_reply_date = serializers.DateTimeField(read_only=True)
    latest_replier = serializers.CharField(read_only=True)

    def get_posts(self, obj):
        return PostSerializer(obj.post_set.all(), many=True).data

    class Meta:
        model = Thread
        fields = ['id', 'name', 'is_sticky', 'created_at', 'is_locked', 'board', 'posts', 'latest_reply_date',
                  'latest_replier']

    def create(self, validated_data):
        name = validated_data['name']
        is_sticky = validated_data['is_sticky']
        created_at = validated_data['created_at']
        is_locked = validated_data['is_locked']
        board = validated_data['board']
        user = self.context["request"].user
        thread = Thread.objects.create(name=name, is_sticky=is_sticky, created_at=created_at, is_locked=is_locked,
                                       board=board,
                                       author=user)
        return thread


class ReplySerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField('gets_author')

    def gets_author(self, obj):
        return UserSerializer(obj.author, many=False).data

    class Meta:
        model = Reply
        fields = ['id', 'created_at', 'author', 'body', 'post']
        extra_kwargs = {'author': {'required': False}}

    def create(self, validated_data):
        created_at = validated_data['created_at']
        post = validated_data['post']
        body = validated_data['body']
        user = self.context["request"].user
        reply = Reply.objects.create(author=user, post=post, body=body, created_at=created_at)
        return reply


class PostSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField('get_replies')

    def get_replies(self, obj):
        return ReplySerializer(obj.reply_set.all(), many=True).data

    class Meta:
        model = Post
        fields = ['id', 'author', 'created_at', 'message', 'thread', 'replies']
        extra_kwargs = {'author': {'required': False}}

    def create(self, validated_data):
        user = self.context["request"].user
        created_at = validated_data['created_at']
        message = validated_data['message']
        thread = validated_data['thread']
        post = Post.objects.create(author=user, created_at=created_at, message=message, thread=thread)
        return post


def initGroups():
    group, created = Group.objects.get_or_create(name='Admin')
    ct = ContentType.objects.get_for_model(User)
    if not created:
        permission = Permission.objects.bulk_create([
            Permission(codename='create_board', name='Can create a new board', ct=ct),
            Permission(codename='remove_board', name='Can delete an existing board', ct=ct),
            Permission(codename='create_thread', name='Can create a new thread', ct=ct),
            Permission(codename='lock_thread', name='Can lock an existing thread', ct=ct),
            Permission(codename='ban_user', name='Can ban an existing user', ct=ct),
            Permission(codename='create_post', name='Can create a new post', ct=ct),
            Permission(codename='create_reply', name='Can reply to an existing thread', ct=ct),
        ])
        group.permissions.add(permission)
    group, created = Group.objects.get_or_create(name='Moderator')
    if not created:
        permission = Permission.objects.bulk_create([
            Permission(codename='create_thread', name='Can create a new thread', ct=ct),
            Permission(codename='lock_thread', name='Can lock an existing thread', ct=ct),
            Permission(codename='ban_user', name='Can ban an existing user', ct=ct),
            Permission(codename='create_post', name='Can create a new post', ct=ct),
            Permission(codename='create_reply', name='Can reply to an existing thread', ct=ct),
        ])
        group.permissions.add(permission)

    group, created = Group.objects.get_or_create(name='Poster')
    if not created:
        permission = Permission.objects.bulk_create([
            Permission(codename='create_thread', name='Can create a new thread', ct=ct),
            Permission(codename='create_post', name='Can create a new post', ct=ct),
            Permission(codename='create_reply', name='Can reply to an existing thread', ct=ct),
        ])
        group.permissions.add(permission)
