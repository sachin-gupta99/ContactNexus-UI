import { useEffect, useRef, useState } from "react";
import { Modal, Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import { useDispatch } from "react-redux";
import {
  FaUser, FaEnvelope, FaPhone, FaStreetView, FaCity,
  FaGithub, FaLinkedin, FaInstagramSquare,
} from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { TbMapPinCode } from "react-icons/tb";
import { useContactTags, useSaveContact } from "../hooks/useContacts";
import TagInput from "./TagInput";
import ImagePicker from "./ImagePicker";
import { toastActions } from "../store/toast";
import { MONTHS, daysInMonth } from "../util/birthday";

const EMPTY = {
  firstName: "", lastName: "", email: "", phone: "",
  bio: "", imageUrl: "",
  street: "", city: "", state: "", country: "", zipCode: "",
  githubUrl: "", linkedinUrl: "", instagramUrl: "",
  notes: "",
  // Kept as strings for the inputs; converted to numbers (or null) on save.
  birthdayMonth: "", birthdayDay: "", birthdayYear: "",
};

const MAX_NOTES = 10000;
const THIS_YEAR = new Date().getFullYear();

const toInt = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

/**
 * Shared form for creating and editing a contact. `initialContact` null/undefined
 * means create mode; otherwise it pre-fills every field from that contact.
 */
const ContactFormModal = ({ isOpen, onClose, onSaved, initialContact }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY);
  const [tags, setTags] = useState([]);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [pickerKey, setPickerKey] = useState(0); // remounts the picker to clear its preview
  const photoRef = useRef(null);
  const saveContact = useSaveContact();
  const tagOptions = useContactTags().data?.map((t) => t.name) ?? [];
  const submitting = saveContact.isPending;
  const isEdit = Boolean(initialContact?.id);
  const hasPhoto = Boolean(initialContact?.hasPhoto) && !removePhoto;

  // Reset / prefill whenever the modal opens or the subject changes. Only the
  // editable fields are copied, so server-only ones (id, favorite, timestamps,
  // the presigned photo URL) are never sent back.
  useEffect(() => {
    if (!isOpen) return;
    const prefill = { ...EMPTY };
    if (initialContact) {
      for (const key of Object.keys(EMPTY)) prefill[key] = initialContact[key] ?? "";
      if (initialContact.hasPhoto) prefill.imageUrl = "";
    }
    setForm(prefill);
    setTags(initialContact?.tags ?? []);
    setRemovePhoto(false);
    setPickerKey((k) => k + 1);
  }, [isOpen, initialContact]);

  const bind = (field) => ({
    value: form[field] ?? "",
    onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) {
      dispatch(toastActions.setToast({ message: "First name and email are required", type: "error" }));
      return;
    }
    if (!form.email.includes("@")) {
      dispatch(toastActions.setToast({ message: "Enter a valid email", type: "error" }));
      return;
    }
    if (Boolean(form.birthdayMonth) !== Boolean(form.birthdayDay)) {
      dispatch(toastActions.setToast({ message: "A birthday needs both a month and a day", type: "error" }));
      return;
    }

    // Blank strings stay blank (treat as "no value"); backend DTO allows nulls
    // for optional fields but is happy with empty strings too, so no cleanup
    // beyond trimming is needed.
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
    );

    payload.tags = tags;
    payload.birthdayMonth = toInt(form.birthdayMonth);
    payload.birthdayDay = toInt(form.birthdayDay);
    payload.birthdayYear = payload.birthdayMonth ? toInt(form.birthdayYear) : null;
    const photo = photoRef.current?.files?.[0] || null;

    try {
      const { photoFailed } = await saveContact.mutateAsync({
        id: isEdit ? initialContact.id : null,
        payload,
        photo,
        removePhoto: removePhoto && !photo,
      });
      const saved = isEdit ? "Contact updated" : "Contact created";
      dispatch(toastActions.setToast(photoFailed
        ? { message: `${saved}, but the photo could not be saved`, type: "error" }
        : { message: saved, type: "success" }));
      onSaved?.();
      onClose?.();
    } catch (err) {
      // Validation errors arrive as { fields: { name: message } } with no top-level message.
      const data = err.response?.data;
      const field = data?.fields && Object.entries(data.fields)[0];
      const msg = data?.message
        || (field && `${field[0]}: ${field[1]}`)
        || `Could not ${isEdit ? "update" : "create"} contact`;
      dispatch(toastActions.setToast({ message: msg, type: "error" }));
    }
  };

  // `form="contact-form"` on the Footer submit button lets the <form> stay
  // inside Modal.Body (so flowbite's own scroll container still works) while
  // the button sits outside it. Without this split, wrapping Modal.Body +
  // Modal.Footer in a <form> breaks the Body's internal scroll - the modal
  // stops at the viewport and anything past the fold is unreachable.
  return (
    <Modal show={isOpen} onClose={onClose} size="4xl" dismissible>
      <Modal.Header>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isEdit ? "Edit contact" : "Add contact"}
        </span>
      </Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-y-auto">
        <form id="contact-form" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
                Basic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" value="First name *" className="text-gray-700" />
                  <TextInput id="firstName" icon={FaUser} required {...bind("firstName")} />
                </div>
                <div>
                  <Label htmlFor="lastName" value="Last name" className="text-gray-700" />
                  <TextInput id="lastName" icon={FaUser} {...bind("lastName")} />
                </div>
                <div>
                  <Label htmlFor="email" value="Email *" className="text-gray-700" />
                  <TextInput id="email" type="email" icon={FaEnvelope} required {...bind("email")} />
                </div>
                <div>
                  <Label htmlFor="phone" value="Phone" className="text-gray-700" />
                  <TextInput id="phone" type="tel" icon={FaPhone} {...bind("phone")} />
                </div>
              </div>
            </section>

            {/* About */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
                About
              </h3>
              <div>
                <Label htmlFor="bio" value="Bio" className="text-gray-700" />
                <Textarea id="bio" rows={3} className="resize-none" {...bind("bio")} />
              </div>
              <div>
                <Label htmlFor="tags" value="Tags" className="text-gray-700" />
                <TagInput id="tags" value={tags} onChange={setTags} suggestions={tagOptions} />
              </div>
            </section>

            {/* Photo */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
                Photo
              </h3>
              <ImagePicker
                key={pickerKey}
                ref={photoRef}
                label="Upload a photo (PNG, JPEG or GIF, up to 5MB)"
                name="contactPhoto"
                initialImage={hasPhoto ? initialContact.imageUrl : form.imageUrl || null}
              />
              {initialContact?.hasPhoto && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={removePhoto} onChange={(e) => setRemovePhoto(e.target.checked)} />
                  Remove the current photo
                </label>
              )}
              {!hasPhoto && (
                <div>
                  <Label htmlFor="imageUrl" value="Or link to an image" className="text-gray-700" />
                  <TextInput id="imageUrl" type="url" placeholder="https://..." {...bind("imageUrl")} />
                </div>
              )}
            </section>

            {/* Birthday + notes */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
                Birthday &amp; notes
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="birthdayDay" value="Day" className="text-gray-700" />
                  <Select id="birthdayDay" {...bind("birthdayDay")}>
                    <option value="">–</option>
                    {Array.from({ length: daysInMonth(toInt(form.birthdayMonth), toInt(form.birthdayYear)) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthdayMonth" value="Month" className="text-gray-700" />
                  <Select id="birthdayMonth" {...bind("birthdayMonth")}>
                    <option value="">–</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birthdayYear" value="Year (optional)" className="text-gray-700" />
                  <TextInput id="birthdayYear" type="number" inputMode="numeric" min={1900} max={THIS_YEAR}
                    placeholder="e.g. 1990" disabled={!form.birthdayMonth} {...bind("birthdayYear")} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="notes" value="Notes" className="text-gray-700" />
                  <span className="text-xs text-gray-400">{(form.notes || "").length}/{MAX_NOTES}</span>
                </div>
                <Textarea id="notes" rows={4} maxLength={MAX_NOTES} className="resize-y"
                  placeholder="How you met, what they're working on, things to remember…" {...bind("notes")} />
              </div>
            </section>

            {/* Address */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
                Address
              </h3>
              <div>
                <Label htmlFor="street" value="Street" className="text-gray-700" />
                <TextInput id="street" icon={FaStreetView} {...bind("street")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" value="City" className="text-gray-700" />
                  <TextInput id="city" icon={FaCity} {...bind("city")} />
                </div>
                <div>
                  <Label htmlFor="state" value="State" className="text-gray-700" />
                  <TextInput id="state" icon={BiWorld} {...bind("state")} />
                </div>
                <div>
                  <Label htmlFor="country" value="Country" className="text-gray-700" />
                  <TextInput id="country" icon={BiWorld} {...bind("country")} />
                </div>
                <div>
                  <Label htmlFor="zipCode" value="Zip / Pincode" className="text-gray-700" />
                  <TextInput id="zipCode" icon={TbMapPinCode} {...bind("zipCode")} />
                </div>
              </div>
            </section>

            {/* Social */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
                Social
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="githubUrl" value="GitHub URL" className="text-gray-700" />
                  <TextInput id="githubUrl" icon={FaGithub} placeholder="https://github.com/..." {...bind("githubUrl")} />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl" value="LinkedIn URL" className="text-gray-700" />
                  <TextInput id="linkedinUrl" icon={FaLinkedin} placeholder="https://linkedin.com/in/..." {...bind("linkedinUrl")} />
                </div>
                <div>
                  <Label htmlFor="instagramUrl" value="Instagram URL" className="text-gray-700" />
                  <TextInput id="instagramUrl" icon={FaInstagramSquare} placeholder="https://instagram.com/..." {...bind("instagramUrl")} />
                </div>
              </div>
            </section>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          form="contact-form"
          gradientDuoTone="purpleToBlue"
          disabled={submitting}
        >
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create contact"}
        </Button>
        <Button color="gray" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactFormModal;
