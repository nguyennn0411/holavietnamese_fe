import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, X } from 'lucide-react';
import { BilingualText } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { DestinationRegion } from '@/components/destinations/DestinationMetadata';
import { mappedDestinations } from '@/models/DestinationMap';

export function VietnamDiscoveryMap({ destinations, activeId, onActivate, detailRoute }) {
  const instructionsId = useId();
  const { i18n } = useTranslation();
  const isVietnamese = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');
  const markers = mappedDestinations(destinations);
  const selected = destinations.find((destination) => destination.id === activeId);

  return (
    <div
      className="discovery-map"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onActivate(null);
      }}
    >
      <p className="discovery-map__instructions" id={instructionsId}>
        <MapPin size={14} aria-hidden="true" />
        <BilingualText
          vi="Rê chuột hoặc chạm vào điểm đến để khám phá"
          en="Hover or tap a destination to explore"
        />
      </p>

      <div className="discovery-map__layout">
        {/* Map Canvas: Preserves exact 1024x1536 proportions (2:3 aspect ratio) */}
        <div className="discovery-map__stage">
          <div className="discovery-map__canvas">
            <img
              src="/design/vietnam-discovery-map.png"
              width="1024"
              height="1536"
              alt={
                isVietnamese
                  ? 'Bản đồ minh họa các điểm đến Việt Nam, gồm Hoàng Sa và Trường Sa'
                  : 'Illustrated Vietnam destination map, including Hoang Sa and Truong Sa'
              }
              className="discovery-map__artwork"
              draggable="false"
            />
            {markers.map(({ destination, x, y }) => {
              const active = destination.id === activeId;
              const name = isVietnamese ? destination.nameVi : destination.nameEn || destination.nameVi;
              return (
                <button
                  key={destination.id}
                  type="button"
                  className={`discovery-map__pin${active ? ' is-active' : ''}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  data-label-side={x > 55 ? 'left' : 'right'}
                  aria-label={name}
                  aria-describedby={instructionsId}
                  aria-pressed={active}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'touch') onActivate(destination.id);
                  }}
                  onFocus={() => onActivate(destination.id)}
                  onClick={() => onActivate(destination.id)}
                >
                  <span className="discovery-map__pin-dot" aria-hidden="true" />
                  <span className="discovery-map__pin-label" aria-hidden="true">
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Location Detail Card: Adapts side-by-side or stacked via Container Queries */}
        <aside
          className="discovery-map__detail-panel"
          aria-label={isVietnamese ? 'Thông tin điểm đến' : 'Destination information'}
        >
          {selected ? (
            <article className="location-detail-card" aria-live="polite">
              <div className="location-detail-card__thumbnail">
                <ContentImage
                  src={selected.imageUrl}
                  alt={isVietnamese ? selected.nameVi : selected.nameEn || selected.nameVi}
                  className="location-detail-card__image"
                />
                <span className="location-detail-card__region-badge">
                  <DestinationRegion value={selected.region} />
                </span>
                <button
                  type="button"
                  className="location-detail-card__close-btn"
                  onClick={() => onActivate(null)}
                  aria-label={isVietnamese ? 'Bỏ chọn địa điểm' : 'Deselect destination'}
                  title={isVietnamese ? 'Đóng thông tin' : 'Close preview'}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              <div className="location-detail-card__body">
                <div className="location-detail-card__tag">
                  <MapPin size={12} aria-hidden="true" />
                  <span>{isVietnamese ? 'Điểm đến đang chọn' : 'Selected Destination'}</span>
                </div>

                <h3 className="location-detail-card__title">
                  <BilingualText vi={selected.nameVi} en={selected.nameEn} />
                </h3>

                {(selected.shortDescriptionVi || selected.shortDescriptionEn) && (
                  <p className="location-detail-card__desc">
                    <BilingualText
                      vi={selected.shortDescriptionVi || selected.shortDescriptionEn}
                      en={selected.shortDescriptionEn || selected.shortDescriptionVi}
                    />
                  </p>
                )}

                <Link
                  to={generatePath(detailRoute, { id: String(selected.id) })}
                  className="location-detail-card__cta"
                >
                  <span>
                    <BilingualText vi="Khám phá địa điểm" en="Explore destination" />
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ) : (
            <div className="location-detail-card location-detail-card--placeholder">
              <div className="location-detail-card__placeholder-icon">
                <MapPin size={26} aria-hidden="true" />
              </div>
              <h4>
                <BilingualText vi="Khám phá 15 điểm đến Việt Nam" en="Explore 15 Destinations" />
              </h4>
              <p>
                <BilingualText
                  vi="Rê chuột hoặc chạm vào bất kỳ biểu tượng điểm đến nào trên bản đồ để xem ảnh đẹp, câu chuyện văn hóa và khám phá lộ trình bài học."
                  en="Hover or tap any destination marker on the map to preview scenery, cultural stories, and learning paths."
                />
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
