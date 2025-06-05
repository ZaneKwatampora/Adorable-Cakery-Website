from rest_framework.permissions import IsAdminUser
from expenses.models import Expense
from order_system.models import Order
from order_system.serializers import OrderSerializer
from expenses.serializers import ExpenseSerializer
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

class ProfitStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        expenses = Expense.objects.all()
        orders = Order.objects.filter(is_paid=True)

        total_expenses = sum(e.amount for e in expenses)
        total_sales = sum(o.total_price for o in orders)

        profit = total_sales - total_expenses

        return Response({
            'total_sales': total_sales,
            'total_expenses': total_expenses,
            'profit': profit,
        })
