import { useState } from "react"
import { Button } from "./Button"
import { archetype } from "../icons"
import { Loading } from "./Loading"
import {
  Store,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  FilterOption,
  DeemphasizeOption,
} from "./Store"
import { Text } from "./Text"
import { Title } from "./Title"
import { useAccount } from "../hooks/useAccount"
import type { SortOption } from "./Store"
import type { StoreType, FilterRule } from "../types"
import "./Layout.css"
import { STORE_OPTIONS } from "../types"
import { RuleBasedFilters } from "./RuleBasedFilters/RuleBasedFilters"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { SplitRuleWrapper } from "./RuleBasedFilters/components/SplitRuleWrapper"
import { Rule } from "./RuleBasedFilters/components/Rule"

export function Layout() {
  let account = useAccount()
  let [activeChar, setActiveChar] = useLocalStorage<string>("active-char", "")
  let [sortOption, setSortOption] = useLocalStorage<SortOption>(
    "sort-option",
    SORT_OPTIONS[0]!
  )
  let [rbfOption, setRBFOption] = useLocalStorage<FilterRule[]>(
    "filter-rules",
    [{ minStats: 360 }]
  )
  let [filterOption, setFilterOption] = useLocalStorage<FilterOption>(
    "filter-option",
    FILTER_OPTIONS[0]!
  )
  let [storeType, setStoreType] = useLocalStorage<StoreType>(
    "store-type",
    "credits"
  )
  let [enableRuleBasedFiltering, setEnableRuleBasedFiltering] = useLocalStorage(
    "enable-rule-based-filter",
    false
  )
  let [deemphasizeOption, setDeemphasizeOption] =
    useLocalStorage<DeemphasizeOption>("deemphasize-selection", "none")

  let [focusedInput, setFocusedInput] = useState<string>("")

  if (!account) {
    return (
      <>
        <Title>Armoury Exchange</Title>
        <Loading />
      </>
    )
  }

  if (account.characters[0] && !activeChar) {
    setActiveChar(account.characters[0].id)
  }

  if (
    activeChar &&
    account.characters.length &&
    !account.characters.find((char) => char.id === activeChar)
  ) {
    setActiveChar(account.characters[0].id)
  }

  return (
    <>
      <Title>Armoury Exchange</Title>
      <SplitRuleWrapper columns={2}>
        <Rule
          label={"Filter By"}
          type={"select"}
          name={"filter_by"}
          value={filterOption}
          focus={focusedInput}
          dataValues={FILTER_OPTIONS}
          onChange={function (event) {
            setFilterOption(event.target.value as FilterOption)
          }}
          onFocus={(event) => setFocusedInput(event.target.id)}
          onBlur={() => setFocusedInput("")}
        />
        <Rule
          label={"Sort By"}
          type={"select"}
          name={"sort_by"}
          value={sortOption}
          focus={focusedInput}
          dataValues={SORT_OPTIONS}
          onChange={function (event) {
            setSortOption(event.target.value as SortOption)
          }}
          onFocus={(event) => setFocusedInput(event.target.id)}
          onBlur={() => setFocusedInput("")}
        />
      </SplitRuleWrapper>
      <div className="sort-row">
        <label htmlFor="enable-rule-based-filter">
          <Text>Enable rule based filtering: </Text>
        </label>
        <input
          type="checkbox"
          id="enable-rule-based-filter"
          checked={enableRuleBasedFiltering}
          onChange={(event) => {
            setEnableRuleBasedFiltering(event.target.checked)
          }}
        />
      </div>

      {enableRuleBasedFiltering ? (
        <div className="rbf-row">
          <RuleBasedFilters
            state={rbfOption}
            setState={setRBFOption}
            DE={deemphasizeOption}
            setDE={setDeemphasizeOption}
          />
        </div>
      ) : null}


      {account.characters.map((character) => {
        return (
        <div key={character.id}>{character.name}<br />
        	<span
	          style={{
	            textTransform: "capitalize",
	            fontSize: "12px",
	          }}
        	>Credits</span>
		      <Store
        		character={character}
		        storeType={"credits"}
		        sortOption={sortOption}
		        filterOption={filterOption}
		        enableRuleBasedFilterOption={enableRuleBasedFiltering}
		        filterRules={rbfOption}
		        deemphasizeOption={deemphasizeOption}
		      />
		      <span
	          style={{
	            textTransform: "capitalize",
	            fontSize: "12px",
	          }}
        	>Marks</span>
		      <Store
        		character={character}
		        storeType={"marks"}
		        sortOption={sortOption}
		        filterOption={filterOption}
		        enableRuleBasedFilterOption={enableRuleBasedFiltering}
		        filterRules={rbfOption}
		        deemphasizeOption={deemphasizeOption}
		      />
		    </div>
        )
      })}
    </>
  )
}
