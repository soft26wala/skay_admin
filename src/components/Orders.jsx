import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../store/slices/orderSlice";
import "./dashboard-components/print.css";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Printer,
  Trash2,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  Eye,
  AlertTriangle,
  X,
  FileText,
  Sparkles,
} from "lucide-react";

const Orders = () => {
  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStaus, setFilterByStaus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());

    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 30000); // 30 sec poll

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: newStatus }));
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders =
    filterByStaus === "All"
      ? orders || []
      : orders?.filter((order) => order.order_status === filterByStaus) || [];

  const confirmDelete = () => {
    dispatch(deleteOrder(deleteConfirm.id));
    setDeleteConfirm({ open: false, id: null });
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30">
            <Truck className="w-3.5 h-3.5" />
            Shipped
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-300 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  // Count per status
  const counts = {
    All: orders?.length || 0,
    Processing: orders?.filter((o) => o.order_status === "Processing").length || 0,
    Shipped: orders?.filter((o) => o.order_status === "Shipped").length || 0,
    Delivered: orders?.filter((o) => o.order_status === "Delivered").length || 0,
    Cancelled: orders?.filter((o) => o.order_status === "Cancelled").length || 0,
  };

  return (
    <>
      <main className="pl-4 md:pl-[19rem] lg:pl-[20rem] pr-4 md:pr-8 py-6 w-full min-h-screen text-slate-100 bg-[#080B11]/50">
        <Header />

        {/* Page Title & Luxury Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Atelier Fulfillment
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {orders?.length || 0} Total Formulations Dispatched
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
              Orders & Consignments
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time oversight of client acquisitions, status transitions, and haute botanical billing.
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {statusArray.map((status) => {
            const isActive = filterByStaus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterByStaus(status)}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-transparent text-amber-200 border border-amber-500/40 shadow-glow-gold"
                    : "bg-[#131926]/70 text-slate-400 border border-white/[0.06] hover:border-amber-500/20 hover:text-slate-200"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {counts[status]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Order Cards Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
            <p className="mt-4 text-xs font-serif tracking-widest text-slate-400 uppercase">
              Accessing Atelier Records...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-gradient-to-b from-[#131926] to-[#0D111A] border border-white/[0.08] rounded-2xl p-12 text-center max-w-xl mx-auto my-12 shadow-card-luxury">
            <Package className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              No Consignments In This Stage
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Currently there are no active client orders matching "{filterByStaus}".
            </p>
            <button
              onClick={() => setFilterByStaus("All")}
              className="px-5 py-2.5 rounded-xl text-xs font-medium tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold hover:shadow-glow-gold transition-all"
            >
              View All Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStatus =
                selectedStatus[order.id] || order.order_status;
              const isCOD = order.paid_at === null || order.payment_method === "COD";

              return (
                <div
                  key={order.id}
                  className="bg-gradient-to-b from-[#131926] via-[#0E131E] to-[#0A0D14] border border-white/[0.08] rounded-2xl p-5 md:p-6 shadow-card-luxury hover:border-amber-500/30 transition-all duration-300"
                >
                  {/* Card Top: Order ID + Badges + Actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                          Order
                        </span>
                        <span className="font-mono text-sm font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                          #{order.id}
                        </span>
                      </div>

                      {/* Payment Badge */}
                      {isCOD ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/25">
                          <CreditCard className="w-3.5 h-3.5" />
                          COD • Pay on Delivery
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                          <CreditCard className="w-3.5 h-3.5" />
                          Online Paid
                        </span>
                      )}

                      {/* Status Badge */}
                      {getStatusBadge(order.order_status)}

                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(order.created_at).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Order Action Controls */}
                    <div className="flex items-center gap-2.5">
                      {/* Status Selector Dropdown */}
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-[#0B0F17] text-slate-200 text-xs rounded-xl px-3 py-2 border border-white/[0.12] focus:border-amber-400/60 focus:outline-none transition cursor-pointer"
                      >
                        {statusArray
                          .filter((s) => s !== "All")
                          .map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#0B0F17] text-slate-200"
                            >
                              Status: {status}
                            </option>
                          ))}
                      </select>

                      {/* Invoice Button */}
                      <button
                        onClick={() => setSelectedOrderForBill(order)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:border-amber-400/50 transition-all shadow-sm"
                        title="Generate Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          setDeleteConfirm({ open: true, id: order.id })
                        }
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Middle: Split Info (Shipping Details & Price Telemetry) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-5 border-b border-white/[0.06]">
                    {/* Client & Shipping Info (Col 1-2) */}
                    <div className="lg:col-span-2 bg-[#0B0F17]/60 border border-white/[0.05] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-amber-400/80" />
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 font-serif">
                          Client & Delivery Coordinates
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400">Recipient Name</p>
                          <p className="font-semibold text-slate-100 mt-0.5">
                            {order.shipping_info?.full_name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Direct Contact</p>
                          <p className="font-semibold text-slate-100 mt-0.5 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {order.shipping_info?.phone || "N/A"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-slate-400">Atelier Delivery Address</p>
                          <p className="font-medium text-slate-200 mt-0.5 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 flex-shrink-0" />
                            <span>
                              {order.shipping_info?.address || "N/A"}
                              {order.shipping_info?.city
                                ? `, ${order.shipping_info.city}`
                                : ""}
                              {order.shipping_info?.state
                                ? `, ${order.shipping_info.state}`
                                : ""}
                              {order.shipping_info?.pincode
                                ? ` - ${order.shipping_info.pincode}`
                                : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary (Col 3) */}
                    <div className="bg-[#0B0F17]/60 border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="w-4 h-4 text-amber-400/80" />
                          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-300 font-serif">
                            Consignment Value
                          </h4>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-400">
                          <div className="flex justify-between">
                            <span>Base Items</span>
                            <span className="font-mono text-slate-300">
                              $
                              {(
                                Number(order.total_price || 0) -
                                Number(order.tax_price || 0) -
                                Number(order.shipping_price || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes & Duties</span>
                            <span className="font-mono text-slate-300">
                              ${Number(order.tax_price || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>White Glove Delivery</span>
                            <span className="font-mono text-slate-300">
                              ${Number(order.shipping_price || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/[0.08] mt-3 flex justify-between items-baseline">
                        <span className="text-xs font-serif uppercase tracking-wider text-slate-300">
                          Total Payable
                        </span>
                        <span className="text-xl font-serif font-bold text-amber-300 tracking-wide">
                          ${Number(order.total_price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Formulations / Ordered Items */}
                  <div className="mt-4">
                    <h5 className="text-xs font-serif uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                      Acquired Formulations (
                      {Array.isArray(order.order_items)
                        ? order.order_items.length
                        : 0}
                      )
                    </h5>

                    {Array.isArray(order.order_items) &&
                    order.order_items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.order_items.map((item) => (
                          <div
                            key={item.order_item_id}
                            className="bg-[#0B0F17]/40 border border-white/[0.04] rounded-xl p-3 flex items-center gap-3 hover:border-amber-400/20 transition"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-14 h-14 rounded-lg object-cover cursor-pointer border border-white/[0.1] hover:scale-105 transition"
                                onClick={() => setPreviewImage(item.image)}
                                title="Click to inspect botanical"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-500" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm font-semibold text-slate-100 truncate">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                                <span>
                                  Qty:{" "}
                                  <strong className="text-slate-200">
                                    {item.quantity}
                                  </strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Rate:{" "}
                                  <strong className="text-slate-200">
                                    ${Number(item.price || 0).toFixed(2)}
                                  </strong>
                                </span>
                                <span>•</span>
                                <span className="text-amber-300 font-bold">
                                  $
                                  {(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        No formulation items recorded in this consignment.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* IMAGE PREVIEW MODAL */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-2xl w-full bg-[#0E131E] border border-amber-400/30 rounded-2xl p-3 shadow-2xl">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-1.5 hover:bg-rose-500/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewImage}
                alt="Formulation Preview"
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirm.open && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gradient-to-b from-[#161D2B] to-[#0E131E] border border-white/10 rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mx-auto mb-4 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Revoke Consignment #{deleteConfirm.id}?
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                This will permanently purge this client consignment and its associated dispatch records from the atelier database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ open: false, id: null })}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAX INVOICE POPUP */}
        {selectedOrderForBill && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0B0F17] border border-amber-400/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
              {/* Header */}
              <div className="bg-[#131926] px-6 py-4 border-b border-white/[0.08] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-base text-white">
                    Haute Botanicals Tax Invoice
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderForBill(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Invoice Body */}
              <div
                id="printable-bill"
                className="p-6 md:p-8 overflow-y-auto text-xs space-y-4 text-slate-300 bg-white print:bg-white print:text-black"
              >
                {/* Brand Header */}
                <div className="text-center border-b border-slate-200 pb-4">
                  <h1 className="text-xl font-serif font-bold tracking-widest text-slate-900 uppercase">
                    SKAY PRODUCTS
                  </h1>
                  <p className="text-slate-600 text-[11px] font-medium tracking-wide">
                    Canadian Haute Botanicals & Organic Formulations Atelier
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Boutique: skayproducts.com • BN: BN-7829104-CA • Ontario, Canada
                  </p>
                </div>

                {/* Invoice Meta */}
                <div className="flex justify-between items-start text-slate-800 text-xs">
                  <div>
                    <p>
                      <strong className="text-slate-900">Invoice:</strong>{" "}
                      INV-{selectedOrderForBill.id}
                    </p>
                    <p>
                      <strong className="text-slate-900">Date:</strong>{" "}
                      {new Date(
                        selectedOrderForBill.created_at
                      ).toLocaleDateString([], {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <strong className="text-slate-900">Payment Mode:</strong>{" "}
                      <span className="uppercase font-semibold">
                        {selectedOrderForBill.payment_method || "COD"}
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-900">Consignment:</strong>{" "}
                      {selectedOrderForBill.order_status}
                    </p>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-slate-900 mb-1">
                    Billed & Dispatched To:
                  </p>
                  <p className="font-semibold">
                    {selectedOrderForBill.shipping_info?.full_name}
                  </p>
                  <p>{selectedOrderForBill.shipping_info?.address}</p>
                  <p>
                    {selectedOrderForBill.shipping_info?.city},{" "}
                    {selectedOrderForBill.shipping_info?.state} -{" "}
                    {selectedOrderForBill.shipping_info?.pincode}
                  </p>
                  <p className="font-mono mt-1">
                    Phone: {selectedOrderForBill.shipping_info?.phone}
                  </p>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-slate-300 text-slate-800">
                  <thead>
                    <tr className="bg-slate-100 font-semibold text-slate-900">
                      <th className="border border-slate-300 p-2 text-left">
                        Formulation / Botanical
                      </th>
                      <th className="border border-slate-300 p-2 text-center w-16">
                        Qty
                      </th>
                      <th className="border border-slate-300 p-2 text-right w-24">
                        Rate
                      </th>
                      <th className="border border-slate-300 p-2 text-right w-28">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForBill.order_items?.map((item) => (
                      <tr key={item.order_item_id} className="border-b border-slate-200">
                        <td className="border border-slate-300 p-2 font-medium">
                          {item.title}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono">
                          {item.quantity}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                          ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="space-y-1 text-right text-slate-800">
                  <p>
                    Subtotal: $
                    {(
                      Number(selectedOrderForBill.total_price) -
                      Number(selectedOrderForBill.tax_price || 0) -
                      Number(selectedOrderForBill.shipping_price || 0)
                    ).toFixed(2)}
                  </p>
                  <p>
                    Taxes / Duties: $
                    {Number(selectedOrderForBill.tax_price || 0).toFixed(2)}
                  </p>
                  <p>
                    White-Glove Shipping: $
                    {Number(selectedOrderForBill.shipping_price || 0).toFixed(2)}
                  </p>
                  <p className="font-bold text-base text-slate-950 border-t border-slate-300 pt-2 mt-2">
                    Total Amount: $
                    {Number(selectedOrderForBill.total_price).toFixed(2)}
                  </p>
                </div>

                {/* Footer Notes */}
                <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
                  <p className="font-medium text-slate-700">
                    Hand-crafted in Canada. Fresh organic flacon integrity guaranteed.
                  </p>
                  <p>Thank you for patronizing Skay Products Canadian Haute Botanicals.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#131926] border-t border-white/[0.08] flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold py-2.5 rounded-xl text-xs transition shadow-glow-gold"
                >
                  <Printer className="w-4 h-4" />
                  Print Tax Invoice
                </button>
                <button
                  onClick={() => setSelectedOrderForBill(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Orders;
