import { useEffect, useRef, useState } from "react";
import { Modal, Button, Label, TextInput, Textarea } from "flowbite-react";
import { useDispatch } from "react-redux";
import { HiUser } from "react-icons/hi";
import { FaPhoneAlt, FaStreetView, FaCity, FaGithub, FaLinkedin, FaInstagramSquare } from "react-icons/fa";
import { TiChartArea } from "react-icons/ti";
import { BiWorld } from "react-icons/bi";
import { TbMapPinCode } from "react-icons/tb";
import { MdMovie, MdInterests, MdWork } from "react-icons/md";
import { BsPersonBadgeFill } from "react-icons/bs";
import ImagePicker from "./ImagePicker";
import { updateProfileRoute, uploadAvatarRoute } from "../api/userApi";
import { toastActions } from "../store/toast";
import { userActions } from "../store/user";

const PROFILE_FIELDS = [
  "work", "phone", "street", "area", "city", "state", "pincode",
  "github", "linkedin", "instagram", "likes", "movie", "interests",
  "bioHeading", "bioDescription",
];

const toForm = (user) => ({
  name: user?.name ?? "",
  ...Object.fromEntries(PROFILE_FIELDS.map((f) => [f, user?.profile?.[f] ?? ""])),
});

// The validation handler returns { fields: { "profile.city": "size must be..." } }
// rather than a message, so surface the first field error.
const errorMessage = (err) => {
  const data = err.response?.data;
  if (data?.message) return data.message;
  const [field, reason] = Object.entries(data?.fields || {})[0] || [];
  return field ? `${field.replace("profile.", "")}: ${reason}` : "Could not save your profile";
};

const Field = ({ id, label, icon, value, onChange, type = "text", placeholder }) => (
  <div>
    <Label htmlFor={id} value={label} className="text-gray-700" />
    <TextInput id={id} type={type} icon={icon} placeholder={placeholder} value={value} onChange={onChange} />
  </div>
);

const Section = ({ title, children }) => (
  <section className="space-y-4">
    <h3 className="text-sm font-semibold text-blue-600 border-b border-gray-200 pb-2 uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </section>
);

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const imageRef = useRef();
  const [form, setForm] = useState(toForm(user));
  const [stage, setStage] = useState(null); // null | "saving" | "uploading"

  useEffect(() => {
    if (isOpen) setForm(toForm(user));
  }, [isOpen, user]);

  const bind = (field) => ({
    value: form[field],
    onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stage) return;
    if (!form.name.trim()) {
      dispatch(toastActions.setToast({ message: "Name is required", type: "error" }));
      return;
    }

    const { name, ...profile } = form;
    const image = imageRef.current?.files?.[0];

    setStage("saving");
    try {
      const { data: updated } = await updateProfileRoute({ name, profile });
      let saved = updated;
      let message = "Profile updated";

      // Text first, then the photo: a failed upload must not lose the text edits.
      if (image) {
        setStage("uploading");
        try {
          const avatar = await uploadAvatarRoute(image);
          saved = { ...updated, profile: { ...updated.profile, imageUrl: avatar.data.imageUrl } };
        } catch {
          message = "Profile updated, but the photo could not be uploaded";
        }
      }

      dispatch(userActions.setUser(saved));
      dispatch(toastActions.setToast({ message, type: message === "Profile updated" ? "success" : "error" }));
      onClose();
    } catch (err) {
      dispatch(toastActions.setToast({ message: errorMessage(err), type: "error" }));
    } finally {
      setStage(null);
    }
  };

  const busy = Boolean(stage);

  // Form sits inside Modal.Body (so the body scrolls) and the footer button submits
  // it via form="edit-profile-form".
  return (
    <Modal show={isOpen} onClose={busy ? undefined : onClose} size="4xl" dismissible={!busy}>
      <Modal.Header>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit profile
        </span>
      </Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-y-auto">
        <form id="edit-profile-form" onSubmit={handleSubmit}>
          <fieldset disabled={busy} className="space-y-6">
            <Section title="Photo">
              {/* Keyed on isOpen so a cancelled pick doesn't linger into the next open. */}
              <ImagePicker
                key={String(isOpen)}
                label="Profile image"
                name="avatar"
                ref={imageRef}
                initialImage={user?.profile?.imageUrl}
              />
            </Section>

            <Section title="About you">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" value="Full name *" className="text-gray-700" />
                  <TextInput id="name" icon={HiUser} required {...bind("name")} />
                </div>
                <Field id="work" label="Work / profession" icon={MdWork} {...bind("work")} />
                <Field id="phone" label="Phone" type="tel" icon={FaPhoneAlt} {...bind("phone")} />
                <div>
                  <Label htmlFor="email" value="Email" className="text-gray-700" />
                  <TextInput id="email" value={user?.email ?? ""} disabled helperText="Email can't be changed here." />
                </div>
              </div>
              <Field id="bioHeading" label="Bio heading" icon={BsPersonBadgeFill} {...bind("bioHeading")} />
              <div>
                <Label htmlFor="bioDescription" value="Bio description" className="text-gray-700" />
                <Textarea id="bioDescription" rows={4} maxLength={1000} className="resize-none" {...bind("bioDescription")} />
              </div>
            </Section>

            <Section title="Address">
              <Field id="street" label="House / flat no., street" icon={FaStreetView} {...bind("street")} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="area" label="Area" icon={TiChartArea} {...bind("area")} />
                <Field id="city" label="City" icon={FaCity} {...bind("city")} />
                <Field id="state" label="State" icon={BiWorld} {...bind("state")} />
                <Field id="pincode" label="Pincode" icon={TbMapPinCode} {...bind("pincode")} />
              </div>
            </Section>

            <Section title="Social & interests">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field id="github" label="GitHub" icon={FaGithub} {...bind("github")} />
                <Field id="linkedin" label="LinkedIn" icon={FaLinkedin} {...bind("linkedin")} />
                <Field id="instagram" label="Instagram" icon={FaInstagramSquare} {...bind("instagram")} />
                <Field id="likes" label="Likes / hobbies" icon={BsPersonBadgeFill} {...bind("likes")} />
                <Field id="movie" label="Favourite movies" icon={MdMovie} {...bind("movie")} />
                <Field id="interests" label="Interests" icon={MdInterests} {...bind("interests")} />
              </div>
            </Section>
          </fieldset>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="edit-profile-form" gradientDuoTone="purpleToBlue" isProcessing={busy} disabled={busy}>
          {stage === "uploading" ? "Uploading photo..." : stage === "saving" ? "Saving..." : "Save changes"}
        </Button>
        <Button color="gray" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
