import battle_opp from './battle_opp.jsx'
import battle_player from './battle_player.jsx'

function Battle() {
    return (
        <div className="row">
            <div className="col-6">
                <battle_player />
            </div>
            <div className="col-6">
                <battle_opp />
            </div>
        </div>
    )
}
