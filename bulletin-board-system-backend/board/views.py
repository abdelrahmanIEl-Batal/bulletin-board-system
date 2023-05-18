from django_filters import rest_framework as filters
from rest_framework import permissions
from rest_framework import generics, viewsets
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, TopicSerializer, BoardSerializer, \
    ThreadSerializer, PostSerializer, ReplySerializer
from django.contrib.auth import login
from .custom_permissions import IsAdmin, IsPoster, IsModerator
from .models import User, Topic, Board, Thread, Post, Reply
from django.db.models import Max, F
from django.db.models.expressions import OuterRef, Subquery


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(serializer.errors)
        user = serializer.save()
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'key': AuthToken.objects.create(user)[1]
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        login(request, user)
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'key': AuthToken.objects.create(user)[1]
        })


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = User.objects.all()


class TopicView(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    queryset = Topic.objects.all()

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticatedOrReadOnly | IsAdmin | IsPoster | IsModerator]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly | IsAdmin]
        return [permission() for permission in permission_classes]

    def get_paginated_response(self, data):
        return Response(data)


class BoardView(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticatedOrReadOnly | IsAdmin | IsPoster | IsModerator]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdmin]
        return [permission() for permission in permission_classes]

    def get_paginated_response(self, data):
        return Response(data)


class ThreadView(viewsets.ModelViewSet):
    serializer_class = ThreadSerializer
    queryset = Thread.objects.annotate(latest_reply_date=Max('post__created_at'), latest_replier=Subquery(
        Post.objects.filter(thread=OuterRef('pk')).values("author__name").order_by('-created_at')[:1])) \
        .order_by('-is_sticky', F('latest_reply_date').desc(nulls_last=True))

    def get_permissions(self):
        if self.action == 'list' or self.action == 'create' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticatedOrReadOnly | IsAdmin | IsPoster | IsModerator]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly, (IsAdmin | IsModerator)]
        return [permission() for permission in permission_classes]

    filter_backends = [filters.DjangoFilterBackend]
    filter_fields = ['board']


class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.order_by('-created_at')

    def get_permissions(self):
        if self.action == 'list' or self.action == 'create' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticatedOrReadOnly | IsAdmin | IsPoster | IsModerator]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly & (IsAdmin | IsModerator)]
        return [permission() for permission in permission_classes]

    filter_backends = [filters.DjangoFilterBackend]
    filter_fields = ['author']


class ReplyView(viewsets.ModelViewSet):
    serializer_class = ReplySerializer
    queryset = Reply.objects.all()

    def get_permissions(self):
        if self.action == 'list' or self.action == 'create' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticatedOrReadOnly | IsAdmin | IsPoster | IsModerator]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly & (IsAdmin | IsModerator)]
        return [permission() for permission in permission_classes]

    def get_paginated_response(self, data):
        return Response(data)
