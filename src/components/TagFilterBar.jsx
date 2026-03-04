import './TagFilterBar.css'

export default function TagFilterBar({ tags, hiddenTagIds, onToggle, onDelete }) {
  // Render nothing when there are no tags yet
  if (tags.length === 0) return null

  return (
    <div className="tag-filter-bar">
      <span className="tag-filter-bar__label">Tags:</span>
      <div className="tag-filter-bar__chips">
        {tags.map(tag => {
          const isHidden = hiddenTagIds.has(tag.id)
          return (
            <div
              key={tag.id}
              className={[
                'tag-filter-bar__chip',
                isHidden ? 'tag-filter-bar__chip--hidden' : '',
              ].filter(Boolean).join(' ')}
              role="button"
              tabIndex={0}
              aria-pressed={!isHidden}
              onClick={() => onToggle(tag.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle(tag.id)}
            >
              <span
                className="tag-filter-bar__chip-dot"
                style={{ backgroundColor: tag.color }}
              />
              <span className="tag-filter-bar__chip-label">{tag.name}</span>
              {/* Use span (not button) to avoid nested interactive element */}
              <span
                className="tag-filter-bar__chip-delete"
                role="button"
                tabIndex={0}
                aria-label={`Delete tag ${tag.name}`}
                onClick={e => { e.stopPropagation(); onDelete(tag.id) }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation()
                    onDelete(tag.id)
                  }
                }}
              >
                ×
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
