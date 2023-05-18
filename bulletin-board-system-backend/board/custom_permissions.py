from rest_framework.permissions import BasePermission


class IsPoster(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Poster').exists()


class IsModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Moderator').exists()


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Admin').exists()
