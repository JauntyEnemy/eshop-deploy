import React from 'react';

const OrderInvoice = ({ order }) => {
    if (!order) return null;

    const formatOrderId = (id) => `#ORD-${id.toString().padStart(4, '0')}`;

    const InvoiceCopy = () => (
        <div className="border border-gray-400 p-6 flex flex-col h-full text-black bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-black pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-wider">{formatOrderId(order.id)}</h1>
                    <p className="text-gray-600 text-xs mt-1">
                        Placed: {new Date(order.created_at).toLocaleString()}
                    </p>
                    <div className="mt-4">
                        <p className="font-bold text-lg">Zahrat Alrabie</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg leading-tight">
                        <p className="uppercase">{order.customer_name}</p>
                        <p className="mt-1">{order.customer_phone}</p>
                    </div>
                    <div className="mt-2 text-sm font-bold w-48 ml-auto text-right break-words leading-tight">
                        {order.customer_address}
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="text-left py-1 w-2/3">Item</th>
                            <th className="text-center py-1">Qty</th>
                            <th className="text-right py-1">Price</th>
                            <th className="text-right py-1">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {order.items?.map((item, i) => (
                            <tr key={i}>
                                <td className="py-2 text-left">{item.product_name}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">{parseFloat(item.price).toFixed(2)}</td>
                                <td className="py-2 text-right">{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="mt-auto border-t-2 border-black pt-4">
                <div className="flex justify-end gap-8 text-sm">
                    <div className="text-right">
                        <p>Subtotal:</p>
                        <p>Delivery:</p>
                        <p className="font-bold text-lg mt-1">Total:</p>
                    </div>
                    <div className="text-right w-24">
                        <p>{parseFloat(order.subtotal).toFixed(2)}</p>
                        <p>{parseFloat(order.delivery_fee).toFixed(2)}</p>
                        <p className="font-bold text-lg mt-1">AED {parseFloat(order.total).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="mt-4 text-[10px] text-center text-gray-400">
                Order Invoice • Zahrat Alrabie
            </div>
        </div>
    );

    return (
        <div className="hidden print:grid print:grid-cols-2 print:grid-rows-2 print:h-screen print:w-screen print:gap-4 print:p-4 fixed inset-0 z-[9999] bg-white">
            <InvoiceCopy />
            <InvoiceCopy />
            <InvoiceCopy />
            <InvoiceCopy />
        </div>
    );
};

export default OrderInvoice;
