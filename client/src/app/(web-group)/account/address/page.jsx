"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  FiPlus, FiEdit2, FiTrash2, FiStar, FiMapPin,
  FiPhone, FiX, FiCheck,
} from "react-icons/fi";
import { axiosApiInstrector, notify } from "@/helper/helper";
import { setData } from "@/redux/reduceres/userReducer";
import Link from "next/link";

// ── Empty address form state ──────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", addressLine1: "", addressLine2: "",
  contact: "", city: "", state: "", country: "India", pincode: "",
};

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (f) => {
  if (!f.addressLine1.trim()) return "Address line 1 is required.";
  if (!f.city.trim())         return "City is required.";
  if (!f.state.trim())        return "State is required.";
  if (!f.country.trim())      return "Country is required.";
  if (!/^\d{6}$/.test(f.pincode)) return "Pincode must be exactly 6 digits.";
  if (f.contact && !/^\d{10}$/.test(f.contact)) return "Contact must be a 10-digit number.";
  return null;
};

// ── Input field component ─────────────────────────────────────────────────────
function Field({ label, name, value, onChange, required, placeholder, type = "text", pattern }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        pattern={pattern}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
      />
    </div>
  );
}

// ── Address form modal ────────────────────────────────────────────────────────
function AddressModal({ editIndex, initial, onClose, onSaved, token }) {
  const isEdit = editIndex !== null;
  const [form,       setForm]       = useState(initial || EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) { setFormError(err); return; }
    setFormError("");
    setSaving(true);
    try {
      const url = isEdit ? `/address/edit/${editIndex}` : "/address/add";
      const method = isEdit ? "put" : "post";
      const response = await axiosApiInstrector[method](
        url,
        form,
        { headers: { authorization: token } }
      );
      if (response.data.flag !== 0) {
        setFormError(response.data.msg || "Failed to save address.");
        return;
      }
      notify(isEdit ? "Address updated!" : "Address added!", 0);
      onSaved(response.data.shipping_address, response.data.default_address);
      onClose();
    } catch (err) {
      setFormError(err?.response?.data?.msg || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-5">
          {isEdit ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Recipient name" />
            <Field label="Contact" name="contact" value={form.contact} onChange={handleChange} placeholder="10-digit mobile" type="tel" />
          </div>

          <Field label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} required placeholder="House / Flat / Street" />
          <Field label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Area / Landmark (optional)" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="City"    name="city"    value={form.city}    onChange={handleChange} required />
            <Field label="State"   name="state"   value={form.state}   onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Country" name="country" value={form.country} onChange={handleChange} required />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required placeholder="6 digits" type="text" />
          </div>

          {formError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-teal-500 disabled:bg-teal-300 text-white rounded-xl font-semibold text-sm transition"
            >
              {saving ? "Saving..." : isEdit ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main address page ─────────────────────────────────────────────────────────
export default function AddressPage() {
  const dispatch = useDispatch();
  const router   = useRouter();
  const user     = useSelector((s) => s.user);

  const [addresses,      setAddresses]      = useState([]);
  const [defaultIndex,   setDefaultIndex]   = useState(0);
  const [loading,        setLoading]        = useState(true);
  const [showModal,      setShowModal]      = useState(false);
  const [editIndex,      setEditIndex]      = useState(null);   // null = add mode
  const [deletingIndex,  setDeletingIndex]  = useState(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (user?.token === null && user?.data === null) {
      // Still loading from localStorage — wait
      return;
    }
    if (!user?.token) {
      router.replace("/user-auth?redirect=/account/address");
    }
  }, [user?.token, user?.data, router]);

  // ── Fetch addresses ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.token) return;
    (async () => {
      try {
        const res = await axiosApiInstrector.get("/address/list", {
          headers: { authorization: user.token },
        });
        if (res.data.flag === 0) {
          setAddresses(res.data.shipping_address || []);
          setDefaultIndex(res.data.default_address ?? 0);
        }
      } catch {
        notify("Could not load addresses.", 1);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.token]);

  // ── After save: update local state + persist to redux user ───────────────
  const onSaved = (updatedAddresses, updatedDefault) => {
    setAddresses(updatedAddresses);
    setDefaultIndex(updatedDefault);
    // Persist back into redux so checkout page always reflects latest
    dispatch(setData({
      user:       { ...user.data, shipping_address: updatedAddresses, default_address: updatedDefault },
      token:      user.token,
      isVerified: user.isVerified,
    }));
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (index) => {
    if (!confirm("Delete this address?")) return;
    setDeletingIndex(index);
    try {
      const res = await axiosApiInstrector.delete(`/address/delete/${index}`, {
        headers: { authorization: user.token },
      });
      if (res.data.flag !== 0) { notify(res.data.msg || "Delete failed.", 1); return; }
      notify("Address deleted.", 0);
      onSaved(res.data.shipping_address, res.data.default_address);
    } catch {
      notify("Could not delete address.", 1);
    } finally {
      setDeletingIndex(null);
    }
  };

  // ── Set default ───────────────────────────────────────────────────────────
  const handleSetDefault = async (index) => {
    if (index === defaultIndex) return;
    try {
      const res = await axiosApiInstrector.put(`/address/set-default/${index}`, {}, {
        headers: { authorization: user.token },
      });
      if (res.data.flag !== 0) { notify(res.data.msg || "Update failed.", 1); return; }
      notify("Default address updated.", 0);
      onSaved(res.data.shipping_address, res.data.default_address);
    } catch {
      notify("Could not update default address.", 1);
    }
  };

  const openAdd  = () => { setEditIndex(null); setShowModal(true); };
  const openEdit = (i) => { setEditIndex(i);    setShowModal(true); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">My Addresses</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your saved delivery addresses.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold text-sm transition shadow"
          >
            <FiPlus /> Add Address
          </button>
        </div>

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex gap-2">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Addresses</span>
        </nav>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && addresses.length === 0 && (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-12 text-center">
            <FiMapPin className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No saved addresses yet.</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Add one to speed up checkout.</p>
            <button
              onClick={openAdd}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition"
            >
              Add your first address
            </button>
          </div>
        )}

        {/* Address cards */}
        {!loading && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((addr, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl shadow border-2 transition-all p-5
                  ${i === defaultIndex ? "border-teal-500" : "border-gray-100"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Address info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-gray-800">
                        {addr.name || user?.data?.name || "—"}
                      </p>
                      {i === defaultIndex && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                          <FiStar size={10} /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {addr.city}, {addr.state}, {addr.country} — {addr.pincode}
                    </p>
                    {addr.contact && (
                      <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                        <FiPhone size={12} /> {addr.contact}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(i)}
                      title="Edit"
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      disabled={deletingIndex === i}
                      title="Delete"
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    {i !== defaultIndex && (
                      <button
                        onClick={() => handleSetDefault(i)}
                        title="Set as default"
                        className="p-2 rounded-xl text-teal-500 hover:bg-teal-50 transition"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to checkout link */}
        <div className="mt-8 text-center">
          <Link href="/checkout" className="text-sm text-teal-600 hover:underline">
            ← Back to Checkout
          </Link>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddressModal
          editIndex={editIndex}
          initial={editIndex !== null ? addresses[editIndex] : EMPTY_FORM}
          onClose={() => setShowModal(false)}
          onSaved={onSaved}
          token={user?.token}
        />
      )}
    </div>
  );
}
