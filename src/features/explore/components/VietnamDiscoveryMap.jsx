import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, X } from 'lucide-react';
import { BilingualText } from '@/shared/components/common/BilingualText';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { mappedDestinations } from '@/features/explore/models/DestinationMap';

export function VietnamDiscoveryMap({ destinations, activeId, onActivate, detailRoute }) {
  const instructionsId = useId();
  const { i18n } = useTranslation();
  const isVietnamese = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');
  const markers = mappedDestinations(destinations);
  const selected = destinations.find(destination => destination.id === activeId);
  const selectedMarker = markers.find(marker => marker.destination.id === activeId);
  const preview = selected && <article key={selected.id} className="discovery-map__preview">
    <ContentImage src={selected.imageUrl} alt={selected.nameVi} className="discovery-map__preview-image" />
    <div className="discovery-map__preview-content">
      <h3><BilingualText vi={selected.nameVi} en={selected.nameEn} /></h3>
      {(selected.shortDescriptionVi || selected.shortDescriptionEn) && <p>
        <BilingualText vi={selected.shortDescriptionVi || selected.shortDescriptionEn} en={selected.shortDescriptionEn} />
      </p>}
      <Link to={generatePath(detailRoute, { id: String(selected.id) })}>
        <BilingualText vi="Khám phá địa điểm" en="Explore destination" />
        <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </div>
    <button type="button" className="discovery-map__close" onClick={() => onActivate(null)}
      aria-label={isVietnamese ? 'Đóng thông tin điểm đến' : 'Close destination preview'}>
      <X size={14} aria-hidden="true" />
    </button>
  </article>;

  return <div className="discovery-map" onKeyDown={event => {
    if (event.key === 'Escape') onActivate(null);
  }}>
    <p className="discovery-map__instructions" id={instructionsId}>
      <MapPin size={14} aria-hidden="true" />
      <BilingualText vi="Rê chuột hoặc chạm vào điểm đến để khám phá" en="Hover or tap a destination to explore" />
    </p>
    <div className="discovery-map__canvas">
      <img src="/design/vietnam-discovery-map.png" width="1024" height="1536"
        alt={isVietnamese ? 'Bản đồ minh họa các điểm đến Việt Nam, gồm Hoàng Sa và Trường Sa' : 'Illustrated Vietnam destination map, including Hoang Sa and Truong Sa'}
        className="discovery-map__artwork" draggable="false" />
      {markers.map(({ destination, x, y }) => {
        const active = destination.id === activeId;
        const name = isVietnamese ? destination.nameVi : destination.nameEn || destination.nameVi;
        return <button key={destination.id} type="button"
          className={`discovery-map__pin${active ? ' is-active' : ''}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          data-label-side={x > 55 ? 'left' : 'right'}
          aria-label={name} aria-describedby={instructionsId} aria-pressed={active}
          onPointerEnter={event => { if (event.pointerType !== 'touch') onActivate(destination.id); }}
          onFocus={() => onActivate(destination.id)}
          onClick={() => onActivate(destination.id)}>
          <span className="discovery-map__pin-dot" aria-hidden="true" />
          <span className="discovery-map__pin-label" aria-hidden="true">{name}</span>
        </button>;
      })}
      {selectedMarker && <div className="discovery-map__popover" style={{
        '--marker-x': `${selectedMarker.x}%`,
        top: selectedMarker.y > 60 ? `calc(${selectedMarker.y}% - 152px)` : `calc(${selectedMarker.y}% + 24px)`,
      }}>{preview}</div>}
    </div>
    {selected && !selectedMarker && <div className="discovery-map__preview-slot">{preview}</div>}
  </div>;
}
