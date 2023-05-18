from django.urls import path, include

from .views import RegisterAPI, LoginAPI, TopicView, BoardView, ThreadView, PostView, ReplyView, UserView
from knox import views as knox_views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"topics", TopicView, basename="topics")
router.register(r"boards", BoardView, basename="boards")
router.register(r"threads", ThreadView, basename="threads")
router.register(r"posts", PostView, basename="posts")
router.register(r"replies", ReplyView, basename="replies")
router.register(r"users", UserView, basename="users")

urlpatterns = [
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('api/', include(router.urls), name='logout'),
]