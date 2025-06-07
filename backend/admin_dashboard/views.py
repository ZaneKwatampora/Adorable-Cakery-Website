from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from order_system.models import Order
from expenses.models import Expense
from products.models import Product
from django.db.models import Sum
from django.contrib.auth import get_user_model

User = get_user_model()

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        total_sales = Order.objects.filter(is_paid=True).aggregate(total=Sum('total_price'))['total'] or 0
        total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
        profit = total_sales - total_expenses

        total_users = User.objects.count()
        total_admins = User.objects.filter(is_staff=True).count()
        total_regular_users = total_users - total_admins

        total_products = Product.objects.count()

        return Response({
            'total_orders': total_orders,
            'total_sales': total_sales,
            'total_expenses': total_expenses,
            'profit': profit,
            'total_users': total_users,
            'total_admins': total_admins,
            'total_regular_users': total_regular_users,
            'total_products': total_products,
        })
