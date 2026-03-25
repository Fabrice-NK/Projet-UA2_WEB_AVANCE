import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

function unwrapListPayload(payload) {
  if (Array.isArray(payload)) return payload;
  const root = payload?.data ?? payload;
  if (Array.isArray(root)) return root;
  if (root && typeof root === "object") {
    const arrayValue = Object.values(root).find((value) => Array.isArray(value));
    return arrayValue || [];
  }
  return [];
}

function buildSchema(fields) {
  const shape = {};
  fields.forEach((field) => {
    if (field.type === "file") return;
    let v;
    if (field.type === "number") {
      v = yup
        .number()
        .typeError(`${field.label} doit être un nombre`)
        .transform((val, orig) => (orig === "" ? undefined : val));
      v = field.required
        ? v.required(`${field.label} est obligatoire`)
        : v.nullable().optional();
    } else if (field.name === "email" || field.type === "email") {
      v = yup.string().email(`${field.label} doit être un email valide`);
      v = field.required
        ? v.required(`${field.label} est obligatoire`)
        : v.optional();
    } else {
      v = yup.string();
      v = field.required
        ? v.required(`${field.label} est obligatoire`).min(1, `${field.label} est obligatoire`)
        : v.optional().nullable();
    }
    shape[field.name] = v;
  });
  return yup.object(shape);
}

function unwrapDetailPayload(payload) {
  return payload?.data ?? payload;
}

function getDefaultValues(fields) {
  return fields.reduce((acc, field) => {
    if (field.type === "checkbox") {
      acc[field.name] = false;
      return acc;
    }
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});
}

export default function EntityCrudPage({
  title,
  entityLabel,
  fields,
  columns,
  service,
  countLabel = "élément(s)",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const schema = useMemo(() => buildSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: getDefaultValues(fields),
    resolver: yupResolver(schema),
  });

  const hasFileField = useMemo(
    () => fields.some((field) => field.type === "file"),
    [fields]
  );

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return items;

    return items.filter((item) => {
      return columns.some((col) => {
        const value = item[col.key];
        return String(value ?? "").toLowerCase().includes(needle);
      });
    });
  }, [items, columns, searchTerm]);

  const loadItems = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const payload = await service.list();
      setItems(unwrapListPayload(payload));
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          `Impossible de charger la liste des ${title.toLowerCase()}.`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const hydrateEditForm = async (id) => {
    try {
      const payload = await service.getById(id);
      const item = unwrapDetailPayload(payload);
      if (!item) return;
      setEditingItem(item);

      const nextValues = {};
      fields.forEach((field) => {
        if (field.type === "file") return;
        nextValues[field.name] = item[field.name] ?? "";
      });
      reset(nextValues);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Chargement impossible.");
    }
  };

  const handleShowDetails = async (id) => {
    try {
      const payload = await service.getById(id);
      setSelectedItem(unwrapDetailPayload(payload));
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Détail indisponible.");
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    reset(getDefaultValues(fields));
  };

  const buildPayload = (formValues) => {
    if (!hasFileField) {
      const output = { ...formValues };
      fields.forEach((field) => {
        if (field.type === "number" && output[field.name] !== "") {
          output[field.name] = Number(output[field.name]);
        }
      });
      return output;
    }

    const formData = new FormData();
    fields.forEach((field) => {
      const value = formValues[field.name];
      if (field.type === "file") {
        if (value?.[0]) {
          formData.append(field.name, value[0]);
        }
        return;
      }

      if (value === undefined || value === null || value === "") {
        if (field.allowEmpty) {
          formData.append(field.name, "");
        }
        return;
      }

      if (field.type === "number") {
        formData.append(field.name, String(Number(value)));
      } else {
        formData.append(field.name, value);
      }
    });

    return formData;
  };

  const onSubmit = async (values) => {
    setErrorMessage("");
    try {
      const payload = buildPayload(values);

      if (editingItem?.id) {
        await service.update(editingItem.id, payload);
      } else {
        await service.create(payload);
      }

      handleCancel();
      setShowForm(false);
      await loadItems();
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length) {
        setErrorMessage(validationErrors.map((item) => item.msg).join(" | "));
      } else {
        setErrorMessage(
          error?.response?.data?.message ||
            `Enregistrement ${entityLabel.toLowerCase()} impossible.`
        );
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Supprimer cet élément ${entityLabel.toLowerCase()} ?`);
    if (!confirmed) return;

    try {
      await service.remove(id);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      if (editingItem?.id === id) {
        handleCancel();
      }
      await loadItems();
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Suppression impossible.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{title}</h2>
          <p className="subtitle">{filteredItems.length} {countLabel}</p>
        </div>
        <button type="button" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Fermer le formulaire" : `Ajouter ${entityLabel}`}
        </button>
      </div>

      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      {showForm ? (
        <div className="card">
          <h3>{editingItem ? `Modifier ${entityLabel}` : `Ajouter ${entityLabel}`}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            {fields.map((field) => (
              <div key={field.name}>
                <label>{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    {...register(field.name, {
                      required: field.required ? `${field.label} est obligatoire` : false,
                    })}
                  />
                ) : field.type === "select" ? (
                  <select
                    {...register(field.name, {
                      required: field.required ? `${field.label} est obligatoire` : false,
                    })}
                  >
                    <option value="">Sélectionner</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    accept={field.accept}
                    {...register(field.name, {
                      required: field.required ? `${field.label} est obligatoire` : false,
                    })}
                  />
                )}

                {errors[field.name] ? (
                  <p className="error">{errors[field.name].message}</p>
                ) : null}
              </div>
            ))}

            <div className="actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : editingItem ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingItem ? (
                <button type="button" onClick={handleCancel}>
                  Annuler
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}

      <div className="card">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : filteredItems.length === 0 ? (
          <p>Aucun élément.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : item[col.key] ?? "-"}
                      </td>
                    ))}
                    <td>
                      <div className="actions">
                        <button type="button" onClick={() => handleShowDetails(item.id)}>
                          Détail
                        </button>
                        <button type="button" onClick={() => hydrateEditForm(item.id)}>
                          Modifier
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedItem ? (
        <div className="card">
          <h3>Détail</h3>
          {Object.entries(selectedItem)
            .filter(([, value]) => typeof value !== "object")
            .map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {String(value ?? "-")}
              </p>
            ))}
        </div>
      ) : null}
    </div>
  );
}
