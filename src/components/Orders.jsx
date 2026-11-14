import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus,
  fetchStallionConfig,
  saveStallionConfig,
  shipWithStallion,
  attachStallionTracking,
  syncStallionTracking,
  syncAllStallionOrders,
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
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Settings,
  ShieldCheck,
  Send,
  Box,
  Navigation,
} from "lucide-react";

const Orders = () => {
  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const dispatch = useDispatch();
  const { orders, loading, stallionConfig, stallionLoading } = useSelector(
    (state) => state.order
  );

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStaus, setFilterByStaus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);

  // Stallion Express State
  const [showStallionModal, setShowStallionModal] = useState(false);
  const [stallionForm, setStallionForm] = useState({
    apiKey: "",
    environment: "production",
    defaultCarrier: "canada_post",
    shipperCity: "Toronto",
    shipperProvince: "ON",
    shipperPostalCode: "M5V 2T6",
    autoSync: true,
  });

  const [shippingOrderModal, setShippingOrderModal] = useState(null);
  const [shipMode, setShipMode] = useState("generate"); // "generate" | "manual"
  const [shipForm, setShipForm] = useState({
    weight: "0.5",
    length: "20",
    width: "15",
    height: "10",
    trackingNumber: "",
    carrier: "canada_post",
    labelUrl: "",
  });

  const [copiedTracking, setCopiedTracking] = useState("");
  const [syncingOrderId, setSyncingOrderId] = useState(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchStallionConfig());

    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 30000); // 30 sec poll

    return () => clearInterval(interval);
  }, [dispatch]);

  // Sync config form with state
  useEffect(() => {
    if (stallionConfig) {
      setStallionForm((prev) => ({
        ...prev,
        apiKey: stallionConfig.apiKey || "",
        environment: stallionConfig.environment || "production",
        defaultCarrier: stallionConfig.defaultCarrier || "canada_post",
        shipperCity: stallionConfig.shipperCity || "Toronto",
        shipperProvince: stallionConfig.shipperProvince || "ON",
        shipperPostalCode: stallionConfig.shipperPostalCode || "M5V 2T6",
        autoSync: stallionConfig.autoSync !== false,
      }));
    }
  }, [stallionConfig]);

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

  const handleCopyTracking = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(""), 2000);
  };

  const handleSyncOrderTracking = async (orderId) => {
    setSyncingOrderId(orderId);
    await dispatch(syncStallionTracking(orderId));
    setSyncingOrderId(null);
  };

  const handleSyncAllOrders = async () => {
    setIsSyncingAll(true);
    await dispatch(syncAllStallionOrders());
    setIsSyncingAll(false);
  };

  const handleSaveStallionConfig = (e) => {
    e.preventDefault();
    dispatch(saveStallionConfig(stallionForm)).then(() => {
      setShowStallionModal(false);
    });
  };

  const handleOpenShipModal = (order) => {
    setShippingOrderModal(order);
    setShipMode("generate");
    setShipForm({
      weight: "0.5",
      length: "20",
      width: "15",
      height: "10",
      trackingNumber: order.stallion_tracking_number || "",
      carrier: order.stallion_carrier || "canada_post",
      labelUrl: order.stallion_label_url || "",
    });
  };

  const handleSubmitShipment = (e) => {
    e.preventDefault();
    if (!shippingOrderModal) return;

    if (shipMode === "generate") {
      dispatch(
        shipWithStallion({
          orderId: shippingOrderModal.id,
          packageInfo: {
            weight: shipForm.weight,
            length: shipForm.length,
            width: shipForm.width,
            height: shipForm.height,
          },
        })
      ).then(() => {
        setShippingOrderModal(null);
      });
    } else {
      dispatch(
        attachStallionTracking({
          orderId: shippingOrderModal.id,
          trackingNumber: shipForm.trackingNumber,
          carrier: shipForm.carrier,
          labelUrl: shipForm.labelUrl,
        })
      ).then(() => {
        setShippingOrderModal(null);
      });
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            Processing
          </span>
        );
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30">
            <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
            Shipped
          </span>
        );
      case "Out for Delivery":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
            Out for Delivery
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-300 border border-slate-500/30">
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
    "Out for Delivery": orders?.filter((o) => o.order_status === "Out for Delivery").length || 0,
    Delivered: orders?.filter((o) => o.order_status === "Delivered").length || 0,
    Cancelled: orders?.filter((o) => o.order_status === "Cancelled").length || 0,
  };

  return (
    <>
      <main className="pl-4 md:pl-[19rem] lg:pl-[20rem] pr-4 md:pr-8 py-6 w-full min-h-screen text-slate-100 bg-[#080B11]/50">
        <Header />

        {/* Page Title & Luxury Subtitle & Stallion Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Atelier Fulfillment
              </span>
              <span className="text-xs text-slate-400 font-mono font-semibold">
                {orders?.length || 0} Total Orders Recorded
              </span>
            </div>
            <h1 className="text-3xl font-serif font-black text-white tracking-wide">
              Orders & Consignments
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Canadian fulfillment with direct Stallion Express (https://stallion.ca/) API integration.
            </p>
          </div>

          {/* STALLION EXPRESS QUICK ACCESS CONTROLS */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowStallionModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-transparent hover:from-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition shadow-sm hover:shadow-glow-gold"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  stallionConfig?.hasKey ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <Truck className="w-4 h-4 text-amber-300 stroke-[2.2]" />
              <span>Stallion Express API</span>
              <Settings className="w-3.5 h-3.5 text-amber-300/80 ml-0.5" />
            </button>

            <button
              onClick={handleSyncAllOrders}
              disabled={isSyncingAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131926] hover:bg-[#1A2234] text-slate-200 border border-white/[0.1] text-xs font-bold transition disabled:opacity-50"
              title="Sync all active shipments with Stallion Express tracking"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-amber-400 ${
                  isSyncingAll ? "animate-spin" : ""
                }`}
              />
              <span>{isSyncingAll ? "Syncing API..." : "Sync All Trackings"}</span>
            </button>
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
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/25 via-amber-400/15 to-transparent text-amber-200 border border-amber-500/40 shadow-glow-gold"
                    : "bg-[#131926]/70 text-slate-400 border border-white/[0.06] hover:border-amber-500/20 hover:text-slate-200"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
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
              className="px-5 py-2.5 rounded-xl text-xs tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:shadow-glow-gold transition-all"
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
              const hasStallion = Boolean(order.stallion_tracking_number);

              return (
                <div
                  key={order.id}
                  className="bg-gradient-to-b from-[#131926] via-[#0E131E] to-[#0A0D14] border border-white/[0.08] rounded-2xl p-5 md:p-6 shadow-card-luxury hover:border-amber-500/30 transition-all duration-300 space-y-5"
                >
                  {/* Card Top: Order ID + Badges + Actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">
                          Order
                        </span>
                        <span className="font-mono text-sm font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                          #{order.id}
                        </span>
                      </div>

                      {/* Payment Badge */}
                      {isCOD ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/25">
                          <CreditCard className="w-3.5 h-3.5" />
                          COD • Pay on Delivery
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                          <CreditCard className="w-3.5 h-3.5" />
                          Online Paid
                        </span>
                      )}

                      {/* Status Badge */}
                      {getStatusBadge(order.order_status)}

                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-mono font-medium">
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
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* SHIP WITH STALLION BUTTON */}
                      {!hasStallion ? (
                        <button
                          onClick={() => handleOpenShipModal(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm hover:shadow-glow-gold transition-all active:scale-95"
                          title="Fulfill and create shipment via Stallion Express"
                        >
                          <Truck className="w-4 h-4 stroke-[2.5]" />
                          <span>Ship with Stallion</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSyncOrderTracking(order.id)}
                          disabled={syncingOrderId === order.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition-all"
                          title="Sync live tracking status from Stallion Express API"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              syncingOrderId === order.id ? "animate-spin" : ""
                            }`}
                          />
                          <span>Sync Status</span>
                        </button>
                      )}

                      {/* Status Selector Dropdown */}
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-[#0B0F17] text-slate-200 text-xs font-bold rounded-xl px-3 py-2 border border-white/[0.12] focus:border-amber-400/60 focus:outline-none transition cursor-pointer"
                      >
                        {statusArray
                          .filter((s) => s !== "All")
                          .map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#0B0F17] text-slate-200 font-semibold"
                            >
                              Status: {status}
                            </option>
                          ))}
                      </select>

                      {/* Invoice Button */}
                      <button
                        onClick={() => setSelectedOrderForBill(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/[0.1] hover:border-amber-400/40 transition-all shadow-sm"
                        title="Generate Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Invoice</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          setDeleteConfirm({ open: true, id: order.id })
                        }
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* STALLION EXPRESS LOGISTICS PANEL (If Shipped) */}
                  {hasStallion && (
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-[#101726] border-2 border-amber-400/35 rounded-xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-400/20">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                            <Truck className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
                                Stallion Express Canadian Logistics
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-amber-400/30 text-amber-300 font-bold uppercase">
                                {order.stallion_carrier || "Canada Post"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-sm sm:text-base font-black text-white tracking-wide">
                                {order.stallion_tracking_number}
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyTracking(order.stallion_tracking_number)
                                }
                                className="text-amber-400 hover:text-amber-300 transition p-1"
                                title="Copy tracking number"
                              >
                                {copiedTracking === order.stallion_tracking_number ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Stallion Action Buttons */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://ship.stallion.ca/track/${order.stallion_tracking_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/35 transition"
                          >
                            <span>Track on Stallion.ca</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {order.stallion_label_url && (
                            <a
                              href={order.stallion_label_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Label</span>
                            </a>
                          )}

                          <button
                            onClick={() => handleOpenShipModal(order)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                            title="Edit tracking number"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Latest Event Stream from Stallion API */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1">
                        <div className="flex items-start gap-2">
                          <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-slate-300 font-medium">
                            <strong className="text-amber-200">Latest Transit Event:</strong>{" "}
                            {order.stallion_tracking_data?.last_event?.description ||
                              "Consignment in transit with Stallion Express distribution hub."}
                            {order.stallion_tracking_data?.last_event?.location && (
                              <span className="text-slate-400 ml-1">
                                ({order.stallion_tracking_data.last_event.location})
                              </span>
                            )}
                          </p>
                        </div>

                        <span className="text-[11px] text-slate-400 font-mono shrink-0">
                          Synced:{" "}
                          {order.stallion_synced_at
                            ? new Date(order.stallion_synced_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Middle: Split Info (Shipping Details & Price Telemetry) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-2 border-b border-white/[0.06]">
                    {/* Client & Shipping Info (Col 1-2) */}
                    <div className="lg:col-span-2 bg-[#0B0F17]/60 border border-white/[0.05] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-amber-400/80" />
                        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 font-serif">
                          Client & Delivery Coordinates
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400 font-medium">Recipient Name</p>
                          <p className="font-bold text-slate-100 mt-0.5 text-sm">
                            {order.shipping_info?.full_name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Direct Contact</p>
                          <p className="font-bold text-slate-100 mt-0.5 flex items-center gap-1.5 text-sm">
                            <Phone className="w-3.5 h-3.5 text-amber-400" />
                            {order.shipping_info?.phone || "N/A"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-slate-400 font-medium">Canadian Delivery Address</p>
                          <p className="font-semibold text-slate-200 mt-0.5 flex items-start gap-1.5">
                            <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
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
                          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 font-serif">
                            Consignment Value
                          </h4>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-400 font-semibold">
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
                            <span>Taxes & GST</span>
                            <span className="font-mono text-slate-300">
                              ${Number(order.tax_price || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="font-mono text-slate-300">
                              ${Number(order.shipping_price || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/[0.08] mt-3 flex justify-between items-baseline">
                        <span className="text-xs font-serif uppercase tracking-wider font-bold text-slate-300">
                          Total Payable
                        </span>
                        <span className="text-2xl font-serif font-black text-amber-300 tracking-wide">
                          ${Number(order.total_price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Formulations / Ordered Items */}
                  <div className="mt-4">
                    <h5 className="text-xs font-serif uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                      Acquired Items (
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
                                title="Click to inspect item"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-500" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm font-bold text-slate-100 truncate">
                                {item.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-mono font-semibold">
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
                                <span className="text-amber-300 font-black">
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

        {/* ================= STALLION API CONFIGURATION MODAL ================= */}
        {showStallionModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0B0F17] border-2 border-amber-400/30 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
              {/* Modal Header */}
              <div className="bg-[#131926] px-6 py-5 border-b border-white/[0.08] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Truck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-white">
                      Stallion Express API Integration
                    </h3>
                    <p className="text-xs font-semibold text-amber-300/80">
                      Link account from https://stallion.ca/
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStallionModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveStallionConfig} className="p-6 overflow-y-auto space-y-5 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1 text-slate-300">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>How to get your API Token:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    Log in to your <strong>Stallion Express</strong> dashboard at{" "}
                    <a
                      href="https://ship.stallion.ca/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline font-bold"
                    >
                      ship.stallion.ca
                    </a>
                    , go to <strong>Settings &rarr; Integrations &rarr; API</strong>, and generate a scoped token with <code>shipments:write</code> and <code>tracking:read</code>.
                  </p>
                </div>

                {/* API Token Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                    Stallion API Bearer Token *
                  </label>
                  <input
                    type="password"
                    value={stallionForm.apiKey}
                    onChange={(e) =>
                      setStallionForm({ ...stallionForm, apiKey: e.target.value })
                    }
                    placeholder="Enter Stallion Express v5 Bearer Token..."
                    className="w-full px-4 py-3 bg-[#131926] border-2 border-white/[0.12] focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none transition"
                  />
                  {stallionConfig?.hasKey && (
                    <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Current token active ({stallionConfig.apiKey})
                    </p>
                  )}
                </div>

                {/* Environment Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                      Environment
                    </label>
                    <select
                      value={stallionForm.environment}
                      onChange={(e) =>
                        setStallionForm({
                          ...stallionForm,
                          environment: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-[#131926] border-2 border-white/[0.12] focus:border-amber-400 rounded-xl text-xs font-bold text-white focus:outline-none transition"
                    >
                      <option value="production">Production (ship.stallion.ca)</option>
                      <option value="sandbox">Sandbox (sandbox.stallion.ca)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                      Default Shipping Carrier
                    </label>
                    <select
                      value={stallionForm.defaultCarrier}
                      onChange={(e) =>
                        setStallionForm({
                          ...stallionForm,
                          defaultCarrier: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-[#131926] border-2 border-white/[0.12] focus:border-amber-400 rounded-xl text-xs font-bold text-white focus:outline-none transition"
                    >
                      <option value="canada_post">Canada Post via Stallion</option>
                      <option value="stallion">Stallion Domestic Ground</option>
                      <option value="ups">UPS Canada</option>
                    </select>
                  </div>
                </div>

                {/* Shipper Origin Address */}
                <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Canadian Origin / Shipper Location
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Origin City
                      </label>
                      <input
                        type="text"
                        value={stallionForm.shipperCity}
                        onChange={(e) =>
                          setStallionForm({
                            ...stallionForm,
                            shipperCity: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Province (e.g. ON)
                      </label>
                      <input
                        type="text"
                        value={stallionForm.shipperProvince}
                        onChange={(e) =>
                          setStallionForm({
                            ...stallionForm,
                            shipperProvince: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={stallionForm.shipperPostalCode}
                        onChange={(e) =>
                          setStallionForm({
                            ...stallionForm,
                            shipperPostalCode: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowStallionModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-glow-gold transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Test & Save Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= SHIP ORDER WITH STALLION MODAL ================= */}
        {shippingOrderModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0B0F17] border-2 border-amber-400/35 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
              {/* Header */}
              <div className="bg-[#131926] px-6 py-4 border-b border-white/[0.08] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Truck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-base text-white">
                      Ship Consignment #{shippingOrderModal.id.slice(0, 8)}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">
                      via Stallion Express Canadian Logistics
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShippingOrderModal(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitShipment} className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Recipient summary card */}
                <div className="bg-[#131926]/70 border border-white/[0.08] rounded-xl p-3.5 space-y-1 text-slate-300">
                  <p className="font-bold text-white text-xs">
                    Recipient: {shippingOrderModal.shipping_info?.full_name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {shippingOrderModal.shipping_info?.address},{" "}
                    {shippingOrderModal.shipping_info?.city},{" "}
                    {shippingOrderModal.shipping_info?.state} -{" "}
                    {shippingOrderModal.shipping_info?.pincode}
                  </p>
                  <p className="text-[11px] font-mono text-amber-300">
                    Phone: {shippingOrderModal.shipping_info?.phone}
                  </p>
                </div>

                {/* Mode Tabs */}
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setShipMode("generate")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${
                      shipMode === "generate"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Generate via Stallion API
                  </button>
                  <button
                    type="button"
                    onClick={() => setShipMode("manual")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${
                      shipMode === "manual"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Attach Existing Tracking
                  </button>
                </div>

                {shipMode === "generate" ? (
                  <div className="space-y-3">
                    <p className="text-slate-300 font-semibold text-xs">
                      Package Specifications (Canadian Express Parcel):
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={shipForm.weight}
                          onChange={(e) =>
                            setShipForm({ ...shipForm, weight: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                          Length (cm)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={shipForm.length}
                          onChange={(e) =>
                            setShipForm({ ...shipForm, length: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                          Width (cm)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={shipForm.width}
                          onChange={(e) =>
                            setShipForm({ ...shipForm, width: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-white font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={shipForm.height}
                          onChange={(e) =>
                            setShipForm({ ...shipForm, height: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#131926] border border-white/[0.12] rounded-xl text-white font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                        Stallion Tracking Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. STAL982341234CA"
                        value={shipForm.trackingNumber}
                        onChange={(e) =>
                          setShipForm({
                            ...shipForm,
                            trackingNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2.5 bg-[#131926] border-2 border-white/[0.12] focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                          Carrier
                        </label>
                        <select
                          value={shipForm.carrier}
                          onChange={(e) =>
                            setShipForm({ ...shipForm, carrier: e.target.value })
                          }
                          className="w-full px-3 py-2.5 bg-[#131926] border border-white/[0.12] rounded-xl text-xs text-white font-bold"
                        >
                          <option value="canada_post">Canada Post</option>
                          <option value="stallion">Stallion Express</option>
                          <option value="ups">UPS Canada</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                          Optional Label URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={shipForm.labelUrl}
                          onChange={(e) =>
                            setShipForm({ ...shipForm, labelUrl: e.target.value })
                          }
                          className="w-full px-3 py-2.5 bg-[#131926] border border-white/[0.12] rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingOrderModal(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={stallionLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-glow-gold transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {stallionLoading
                        ? "Contacting Stallion API..."
                        : shipMode === "generate"
                        ? "Create Shipment & Fulfill"
                        : "Attach Tracking & Mark Shipped"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
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
              <p className="text-xs text-slate-400 mb-6 leading-relaxed font-medium">
                This will permanently purge this client consignment and its associated dispatch records from the atelier database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ open: false, id: null })}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition"
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
                    sKay Products Tax Invoice
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
                  <h1 className="text-xl font-serif font-black tracking-widest text-slate-900 uppercase">
                    SKAY PRODUCTS
                  </h1>
                  <p className="text-slate-700 text-xs font-semibold tracking-wide">
                    Canadian Household Essentials & Modern Living Atelier
                  </p>
                  <p className="text-slate-500 text-[10px] font-medium">
                    Boutique: skayproducts.com • Ontario, Canada
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
                      <span className="uppercase font-bold">
                        {selectedOrderForBill.payment_method || "COD"}
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-900">Consignment:</strong>{" "}
                      <span className="font-bold">{selectedOrderForBill.order_status}</span>
                    </p>
                    {selectedOrderForBill.stallion_tracking_number && (
                      <p>
                        <strong className="text-slate-900">Stallion Tracking:</strong>{" "}
                        <span className="font-mono font-bold text-amber-700">
                          {selectedOrderForBill.stallion_tracking_number}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-slate-900 mb-1">
                    Billed & Dispatched To:
                  </p>
                  <p className="font-bold text-sm">
                    {selectedOrderForBill.shipping_info?.full_name}
                  </p>
                  <p>{selectedOrderForBill.shipping_info?.address}</p>
                  <p>
                    {selectedOrderForBill.shipping_info?.city},{" "}
                    {selectedOrderForBill.shipping_info?.state} -{" "}
                    {selectedOrderForBill.shipping_info?.pincode}
                  </p>
                  <p className="font-mono mt-1 font-bold">
                    Phone: {selectedOrderForBill.shipping_info?.phone}
                  </p>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-slate-300 text-slate-800">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-900">
                      <th className="border border-slate-300 p-2 text-left">
                        Item Description
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
                        <td className="border border-slate-300 p-2 font-semibold">
                          {item.title}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-mono font-bold">
                          {item.quantity}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono font-bold">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono font-black">
                          ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="space-y-1 text-right text-slate-800 font-semibold">
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
                    Shipping: $
                    {Number(selectedOrderForBill.shipping_price || 0).toFixed(2)}
                  </p>
                  <p className="font-black text-base text-slate-950 border-t border-slate-300 pt-2 mt-2">
                    Total Amount: $
                    {Number(selectedOrderForBill.total_price).toFixed(2)}
                  </p>
                </div>

                {/* Footer Notes */}
                <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700">
                    Quality guaranteed essentials. Tracked via Stallion Express Canada.
                  </p>
                  <p>Thank you for shopping with sKay Products.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#131926] border-t border-white/[0.08] flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-glow-gold"
                >
                  <Printer className="w-4 h-4" />
                  Print Tax Invoice
                </button>
                <button
                  onClick={() => setSelectedOrderForBill(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
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
