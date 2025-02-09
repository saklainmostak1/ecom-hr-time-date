import EditExpense from '@/app/(view)/admin/expense/expense_edit/page';
import React from 'react';

const ExpenseEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <EditExpense
            id={id}
            ></EditExpense>
        </div>
    );
};

export default ExpenseEdit;