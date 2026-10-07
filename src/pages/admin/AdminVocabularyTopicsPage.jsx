import { useEffect, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { ResourceState } from '@/components/common/ResourceState';
import { VOCABULARY_STATUSES } from '@/models/AdminVocabulary';
import { adminVocabularyService } from '@/services/adminVocabularyService';

const emptyTopic = {
  name: '',
  slug: '',
  description: '',
  displayOrder: 0,
  status: 'DRAFT',
};

function topicDraft(topic) {
  return {
    name: topic?.name ?? '',
    slug: topic?.slug ?? '',
    description: topic?.description ?? '',
    displayOrder: topic?.displayOrder ?? 0,
    status: topic?.status ?? 'DRAFT',
  };
}

function topicPayload(draft) {
  const name = draft.name.trim();
  const slug = draft.slug.trim();
  const description = draft.description.trim();
  const displayOrder = Number(draft.displayOrder);

  if (!name) {
    throw new Error('Tên chủ đề không được để trống.');
  }

  if (name.length > 100) {
    throw new Error('Tên chủ đề tối đa 100 ký tự.');
  }

  if (!slug) {
    throw new Error('Slug không được để trống.');
  }

  if (slug.length > 120) {
    throw new Error('Slug tối đa 120 ký tự.');
  }

  if (description.length > 500) {
    throw new Error('Mô tả tối đa 500 ký tự.');
  }

  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    throw new Error('Thứ tự hiển thị phải là số nguyên không âm.');
  }

  return {
    name,
    slug,
    description: description || null,
    displayOrder,
    status: draft.status,
  };
}

function AdminVocabularyTopicModal({
  mode,
  id,
  onClose,
  onSaved,
}) {
  const [draft, setDraft] = useState(() => ({ ...emptyTopic }));
  const [loading, setLoading] = useState(mode === 'edit');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'edit') {
      return undefined;
    }

    const controller = new AbortController();

    setLoading(true);
    setError('');

    adminVocabularyService
      .getTopic(id, { signal: controller.signal })
      .then((topic) => {
        if (!controller.signal.aborted) {
          setDraft(topicDraft(topic));
        }
      })
      .catch((loadError) => {
        if (!controller.signal.aborted) {
          setError(loadError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, mode]);

  const change = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError('');
    setBusy(true);

    try {
      const payload = topicPayload(draft);

      const response =
        mode === 'edit'
          ? await adminVocabularyService.updateTopic(id, payload)
          : await adminVocabularyService.createTopic(payload);

      onSaved(response);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={
        mode === 'edit'
          ? 'Chỉnh sửa chủ đề từ vựng'
          : 'Thêm chủ đề từ vựng'
      }
      onClose={onClose}
      busy={busy}
    >
      {loading ? (
        <div className="state loading-state" role="status">
          <span
            className="loading-spinner"
            aria-hidden="true"
          />
          <p>Đang tải chủ đề…</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          {error && (
            <div
              className="ui-notice ui-notice--error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="actions">
            <label style={{ flex: '1 1 220px' }}>
              Tên chủ đề
              <input
                value={draft.name}
                maxLength={100}
                required
                onChange={(event) =>
                  change('name', event.target.value)
                }
              />
            </label>

            <label style={{ flex: '1 1 220px' }}>
              Slug
              <input
                value={draft.slug}
                maxLength={120}
                required
                placeholder="Ví dụ: greetings"
                onChange={(event) =>
                  change('slug', event.target.value)
                }
              />
            </label>
          </div>

          <label>
            Mô tả
            <textarea
              value={draft.description}
              maxLength={500}
              rows={3}
              onChange={(event) =>
                change('description', event.target.value)
              }
            />
          </label>

          <div className="actions">
            <label style={{ flex: '1 1 160px' }}>
              Thứ tự hiển thị
              <input
                type="number"
                min="0"
                step="1"
                value={draft.displayOrder}
                required
                onChange={(event) =>
                  change('displayOrder', event.target.value)
                }
              />
            </label>

            <label style={{ flex: '1 1 180px' }}>
              Trạng thái
              <select
                value={draft.status}
                onChange={(event) =>
                  change('status', event.target.value)
                }
              >
                {VOCABULARY_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            className="actions"
            style={{
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={onClose}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={busy}
            >
              {busy
                ? 'Đang lưu…'
                : mode === 'edit'
                  ? 'Lưu thay đổi'
                  : 'Thêm chủ đề'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export function AdminVocabularyTopicsPage() {
  const [revision, setRevision] = useState(0);

  const [resource, setResource] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState('');

  const reload = () => {
    setRevision((value) => value + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    setResource((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    adminVocabularyService
      .getTopics({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setResource({
            data,
            loading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResource({
            data: [],
            loading: false,
            error,
          });
        }
      });

    return () => controller.abort();
  }, [revision]);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setMessage('');
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  const saved = () => {
    setModal(null);
    setMessage('Lưu chủ đề từ vựng thành công.');
    reload();
  };

  return (
    <div>
      <div
        className="actions"
        style={{
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <h1>Chủ đề từ vựng</h1>
          <p className="muted">
            Quản lý các chủ đề dùng để phân loại từ vựng.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setModal({
              mode: 'create',
              id: null,
            })
          }
        >
          + Thêm chủ đề
        </button>
      </div>

      {message && (
        <div
          className="ui-notice ui-notice--success"
          role="status"
          style={{ marginBottom: 20 }}
        >
          {message}
        </div>
      )}

      <ResourceState
        resource={{
          ...resource,
          reload,
        }}
      >
        {(items) =>
          items.length === 0 ? (
            <div className="state">
              Chưa có chủ đề từ vựng.
            </div>
          ) : (
            <div
              className="admin-card"
              style={{
                padding: 0,
                overflowX: 'auto',
              }}
            >
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tên chủ đề</th>
                    <th>Slug</th>
                    <th>Mô tả</th>
                    <th>Thứ tự</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((topic) => (
                    <tr key={topic.id}>
                      <td>
                        <strong>{topic.name}</strong>
                      </td>

                      <td>{topic.slug}</td>

                      <td>
                        {topic.description || '—'}
                      </td>

                      <td>
                        {topic.displayOrder ?? 0}
                      </td>

                      <td>
                        <span
                          className={`admin-badge ${
                            topic.status === 'PUBLISHED'
                              ? 'admin-badge-success'
                              : topic.status === 'ARCHIVED'
                                ? 'admin-badge-danger'
                                : 'admin-badge-warning'
                          }`}
                        >
                          {topic.status}
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            type="button"
                            className="secondary"
                            onClick={() =>
                              setModal({
                                mode: 'edit',
                                id: topic.id,
                              })
                            }
                          >
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </ResourceState>

      {modal && (
        <AdminVocabularyTopicModal
          key={`${modal.mode}-${modal.id ?? 'new'}`}
          mode={modal.mode}
          id={modal.id}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
    </div>
  );
}