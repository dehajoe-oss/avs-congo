'use client'

/**
 * Composant de drapeaux officiels au format vectoriel SVG
 * Proportions réalistes 3:2 avec géométrie officielle :
 * - CG : République du Congo (Brazzaville / Pointe-Noire) — Diagonale vert / jaune / rouge
 * - CD : République Démocratique du Congo (RDC / Kinshasa) — Bleu ciel, étoile jaune 5 branches, diagonale rouge bordée de jaune
 */
export default function FlagBadge({ code, primary, width = 38, height = 26 }) {
  const renderFlagSvg = () => {
    switch (code) {
      case 'CD': // République Démocratique du Congo (RDC / Kinshasa)
        return (
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            {/* Fond bleu ciel officiel de la RDC */}
            <rect width="300" height="200" fill="#007fff" />
            
            {/* Liserés jaunes extérieurs (traverse du bas-gauche au haut-droit) */}
            <line
              x1="-20"
              y1="213.33"
              x2="320"
              y2="-13.33"
              stroke="#f7d618"
              strokeWidth="40"
              strokeLinecap="square"
            />
            
            {/* Bande diagonale rouge intérieure */}
            <line
              x1="-20"
              y1="213.33"
              x2="320"
              y2="-13.33"
              stroke="#ce1021"
              strokeWidth="24"
              strokeLinecap="square"
            />
            
            {/* Étoile jaune d'or à 5 branches dans le canton supérieur gauche */}
            <polygon
              points="52,22 58.17,39.51 76.73,39.97 61.99,51.24 67.28,69.03 52,58.5 36.72,69.03 42.01,51.24 27.27,39.97 45.83,39.51"
              fill="#f7d618"
            />
          </svg>
        )

      case 'CG': // République du Congo (Congo-Brazzaville / Pointe-Noire)
        return (
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            {/* Triangle supérieur vert forêt */}
            <rect width="300" height="200" fill="#009543" />
            
            {/* Bande diagonale jaune médiane reliant bas-gauche et haut-droit */}
            <polygon points="0,200 200,0 300,0 100,200" fill="#fbde4a" />
            
            {/* Triangle inférieur rouge vermillon */}
            <polygon points="100,200 300,0 300,200" fill="#dc241f" />
          </svg>
        )

      case 'GA': // Gabon
        return (
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            <rect width="300" height="66.67" y="0" fill="#009e60" />
            <rect width="300" height="66.67" y="66.67" fill="#fcd116" />
            <rect width="300" height="66.67" y="133.33" fill="#3a75c4" />
          </svg>
        )

      case 'CM': // Cameroun
        return (
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            <rect width="100" height="200" x="0" fill="#007a5e" />
            <rect width="100" height="200" x="100" fill="#ce1126" />
            <rect width="100" height="200" x="200" fill="#fcd116" />
            <polygon
              points="150,75 156,93 175,93 160,104 165,122 150,111 135,122 140,104 125,93 144,93"
              fill="#fcd116"
            />
          </svg>
        )

      case 'AO': // Angola
        return (
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            <rect width="300" height="100" y="0" fill="#c8102e" />
            <rect width="300" height="100" y="100" fill="#000000" />
            <circle
              cx="150"
              cy="100"
              r="26"
              fill="none"
              stroke="#fcd116"
              strokeWidth="6"
              strokeDasharray="9 5"
            />
            <polygon
              points="150,88 153.5,98.5 164,98.5 155.5,104.5 159,114.5 150,109 141,114.5 144.5,104.5 136,98.5 146.5,98.5"
              fill="#fcd116"
            />
          </svg>
        )

      case 'FR': // France / International
        return (
          <svg
            viewBox="0 0 300 200"
            width="100%"
            height="100%"
            style={{ display: 'block' }}
          >
            <rect width="100" height="200" x="0" fill="#002395" />
            <rect width="100" height="200" x="100" fill="#ffffff" />
            <rect width="100" height="200" x="200" fill="#ed2939" />
          </svg>
        )

      default:
        return (
          <div style={{ width: '100%', height: '100%', background: '#b47027' }} />
        )
    }
  }

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 5,
        overflow: 'hidden',
        flexShrink: 0,
        border: primary
          ? '1.5px solid rgba(180, 112, 39, 0.7)'
          : '1px solid rgba(255, 255, 255, 0.16)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: primary
          ? '0 0 12px rgba(180, 112, 39, 0.35), 0 2px 6px rgba(0,0,0,0.25)'
          : '0 2px 6px rgba(0, 0, 0, 0.25)',
      }}
    >
      {renderFlagSvg()}
    </div>
  )
}
